"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { FloatingActionButton } from "@/components/FloatingActionButton/FloatingActionButton";
import { AddDiaryEntryModal } from "@/components/AddDiaryEntryModal/AddDiaryEntryModal";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  const showFAB =
    pathname === "/" || pathname === "/diary" || pathname.startsWith("/diary");

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);

    window.location.reload();
  };

  return (
    <>
      {children}

      {showFAB && (
        <FloatingActionButton
          onClick={handleOpenModal}
          ariaLabel="Додати новий запис у щоденник"
        />
      )}

      {isModalOpen && (
        <AddDiaryEntryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};
