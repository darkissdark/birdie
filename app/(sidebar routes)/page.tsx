"use client";

import { useState } from "react";
import { AddDiaryEntryModal } from "@/components/AddDiaryEntryModal/AddDiaryEntryModal";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          padding: "12px 24px",
          background: "linear-gradient(135deg, #fbb6ce 0%, #f687b3 100%)",
          color: "white",
          border: "none",
          borderRadius: "25px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(251, 182, 206, 0.4)",
          zIndex: 1000,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 6px 20px rgba(251, 182, 206, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(251, 182, 206, 0.4)";
        }}
      >
        + Додати запис
      </button>

      {isModalOpen && (
        <AddDiaryEntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
