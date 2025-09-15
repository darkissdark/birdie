// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import DiaryEntryDetails from "@/components/DiaryEntryDetails/DiaryEntryDetails";
// import { DiaryEntry } from "@/types/dairy";

// export default function DiaryEntryPage() {
//   const { entryId } = useParams();
//   const router = useRouter();

//   const [entry, setEntry] = useState<DiaryEntry | undefined>(undefined);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchEntry() {
//       setLoading(true);
//       try {
//         const data = await fetch(`/api/diary/${entryId}`).then((res) =>
//           res.json()
//         );
//         setEntry(data);
//       } catch (err) {
//         console.error("Помилка при завантаженні запису:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (entryId) fetchEntry();
//   }, [entryId]);

//   const handleDelete = async () => {
//     try {
//       await fetch(`/api/diary/${id}`, { method: "DELETE" });
//       router.push("/diary");
//     } catch (err) {
//       console.error("Помилка при видаленні:", err);
//     }
//   };

//   const handleUpdate = async () => {
//     if (!entryId) return;
//     try {
//       const data = await fetch(`/api/diary/${entryId}`).then((res) =>
//         res.json()
//       );
//       setEntry(data);
//     } catch (err) {
//       console.error("Помилка при оновленні:", err);
//     }
//   };

//   if (loading) return <p>Завантаження запису...</p>;
//   if (!entry) return <p>Запис не знайдено</p>;

//   return <DiaryEntryDetails entry={entry} />;
// }

// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from "@tanstack/react-query";
// import { getDiaryListServer } from "@/lib/api/serverApi";
// import DiaryEntryDetails from "@/components/DiaryEntryDetails/DiaryEntryDetails";

// interface DiaryIdPageProps {
//   params: Promise<{ id: string }>;
// }

// export default async function DiaryEntryPage({ params }: DiaryIdPageProps) {
//   // Розпаковуємо params асинхронно для Некста
//   const { id } = await params;

//   const queryClient = new QueryClient();

//   // Префетч всього списку на сервері
//   await queryClient.prefetchQuery({
//     queryKey: ["diary"],
//     queryFn: () => getDiaryListServer(params),
//   });

//   // Дістаємо масив для знаходження конкретного запису
//   const { diaryNotes } = await getDiaryListServer(params);
//   const entry = diaryNotes.find((e) => e._id === id);

//   if (!entry) return <p>Запис не знайдено</p>;

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <DiaryEntryDetails entry={entry} />
//     </HydrationBoundary>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DiaryEntryDetails from "@/components/DiaryEntryDetails/DiaryEntryDetails";
import { DiaryEntry } from "@/types/dairy";

export default function DiaryEntryPage() {
  const { entryId } = useParams<{ entryId: string }>();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntry() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://birdie-kohl.vercel.app/api/diary/${entryId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Не вдалося отримати запис");
        const data: DiaryEntry = await res.json();
        setEntry(data);
      } catch (error) {
        console.error("Помилка:", error);
        setEntry(null);
      } finally {
        setLoading(false);
      }
    }

    if (entryId) fetchEntry();
  }, [entryId]);

  if (loading) return <p>Завантаження...</p>;
  if (!entry) return <p>Запис не знайдено</p>;

  return <DiaryEntryDetails entry={entry} />;
}
