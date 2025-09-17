"use client";

import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DiaryEntryDetails from "@/components/DiaryEntryDetails/DiaryEntryDetails";
import { DiaryEntry } from "@/types/diary";
import { deleteDiaryEntry } from "@/lib/api/clientApi";

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
        credentials: "include",
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

  // // Видалення з сервера — з інформативною обробкою помилок

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteDiaryEntry(id);

      sessionStorage.removeItem("selectedEntry");
      router.push("/diary");

      toast.success("Запис успішно видалено!");
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("Помилка при видаленні запису");
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
      onDelete={handleDeleteEntry}
      onUpdate={handleUpdate}
    />
  );
}
