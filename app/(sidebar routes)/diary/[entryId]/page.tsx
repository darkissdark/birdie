"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DiaryEntryDetails from "@/components/DiaryEntryDetails/DiaryEntryDetails";
import { DiaryEntry } from "@/types/diary";

export default function DiaryEntryPage() {
  const params = useParams();
  const router = useRouter();

  // нормалізація id (string | string[] -> string | undefined)
  const rawId = params?.entryId;
  const entryId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = "https://lehlehka.b.goit.study/api";

  // Завантажуємо всі записи (без падіння при помилці)
  const fetchEntries = async (): Promise<DiaryEntry[]> => {
    try {
      const res = await fetch(`${API_BASE}/diary`, {
        cache: "no-store",
        credentials: "include", // важливо, якщо бек вимагає куки
      });

      if (!res.ok) {
        console.warn(
          "⚠️ Помилка завантаження записів:",
          res.status,
          res.statusText
        );
        return [];
      }

      const data = await res.json();
      return data as DiaryEntry[];
    } catch (err) {
      console.error("❌ Помилка при запиті /diary:", err);
      return [];
    }
  };

  // Шукаємо запис: спершу по API, якщо не знайшли — беремо з sessionStorage
  const fetchEntry = async () => {
    setError(null);
    try {
      const entries = await fetchEntries();
      const found = entries.find((e) => e._id === entryId);

      if (found) {
        setEntry(found);
        sessionStorage.setItem("selectedEntry", JSON.stringify(found));
      } else {
        const stored = sessionStorage.getItem("selectedEntry");
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as DiaryEntry;
            setEntry(parsed);
          } catch {
            setEntry(null);
          }
        } else {
          setEntry(null);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити запис. Спробуйте пізніше.");
      setEntry(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entryId) fetchEntry();
    else {
      setLoading(false);
      setEntry(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryId]);

  // Видалення з сервера — з інформативною обробкою помилок
  const handleDelete = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/diary/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const body = await res
          .json()
          .catch(() => ({ message: res.statusText }));
        console.error("Помилка видалення:", body);
        setError(
          `Не вдалося видалити запис: ${body?.message ?? res.statusText}`
        );
        return;
      }

      // очищаємо локальний стейт та sessionStorage — і редірект
      sessionStorage.removeItem("selectedEntry");
      router.push("/diary");
    } catch (err) {
      console.error("Помилка під час видалення:", err);
      setError("Сталася помилка при видаленні запису. Спробуйте ще раз.");
    }
  };

  // Оновлення: якщо модалка повернула оновлений запис — просто підставляємо його,
  // інакше повторно тягнемо з API
  const handleUpdate = async (updated?: DiaryEntry) => {
    setError(null);
    if (updated) {
      setEntry(updated);
      sessionStorage.setItem("selectedEntry", JSON.stringify(updated));
      return;
    }

    // без параметру — перезавантажити з API
    setLoading(true);
    await fetchEntry();
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;
  if (!entry) return <p>Запис не знайдено</p>;

  return (
    <DiaryEntryDetails
      entry={entry}
      onDelete={handleDelete}
      onUpdate={handleUpdate} // тепер може приймати updated entry
    />
  );
}
