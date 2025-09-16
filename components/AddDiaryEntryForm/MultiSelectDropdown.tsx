import React, { useState, useEffect, useRef, useCallback } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { LiaCheckSolid } from "react-icons/lia";
import styles from "../AddDiaryEntryForm/AddDiaryEntryForm.module.css";

export interface DropdownOption {
  _id: string;
  name?: string;
  title?: string;
}

interface MultiSelectDropdownProps {
  options: DropdownOption[];
  selectedValues: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  placeholder?: string;
  error?: boolean;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Оберіть категорію",
  error = false,
  loading = false,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !hasMore || loadingMore || !onLoadMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const scrollThreshold = 20;

    if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
      onLoadMore();
    }
  }, [hasMore, loadingMore, onLoadMore]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement && isDropdownOpen) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => {
        scrollElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isDropdownOpen, handleScroll]);

  const getSelectedDisplay = () => {
    if (selectedValues.length === 0) {
      return { text: placeholder, tags: [] };
    }

    const selectedOptions = selectedValues
      .map((id) => {
        const option = options.find((opt) => opt._id === id);
        return option
          ? { id, name: option.name || option.title || "Без назви" }
          : null;
      })
      .filter(Boolean) as { id: string; name: string }[];

    return {
      text: selectedOptions.map((opt) => opt.name).join(", "),
      tags: selectedOptions,
    };
  };

  const handleOptionToggle = (optionId: string) => {
    const isSelected = selectedValues.includes(optionId);
    const newSelection = isSelected
      ? selectedValues.filter((id) => id !== optionId)
      : [...selectedValues, optionId];

    onSelectionChange(newSelection);
  };

  const display = getSelectedDisplay();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <span>Завантаження категорій...</span>
      </div>
    );
  }

  return (
    <div className={styles.customSelect} ref={dropdownRef}>
      <div
        className={`${styles.selectTrigger} ${
          isDropdownOpen ? styles.selectTriggerOpen : ""
        } ${error ? styles.error : ""}`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className={styles.selectContent}>
          {selectedValues.length === 0 ? (
            <span className={styles.selectPlaceholder}>{placeholder}</span>
          ) : (
            <div className={styles.selectedTags}>
              {display.tags.map((tag) => (
                <span key={tag.id} className={styles.selectedTag}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <span
          className={`${styles.selectArrow} ${
            isDropdownOpen ? styles.selectArrowOpen : ""
          }`}
        >
          <IoIosArrowDown />
        </span>
      </div>

      {isDropdownOpen && (
        <div className={styles.selectDropdown}>
          <div className={styles.selectDropdownInner} ref={scrollRef}>
            {options.map((option) => {
              const isSelected = selectedValues.includes(option._id);
              return (
                <button
                  key={option._id}
                  type="button"
                  className={`${styles.selectOption} ${
                    isSelected ? styles.selectOptionSelected : ""
                  }`}
                  onClick={() => handleOptionToggle(option._id)}
                >
                  <div className={styles.checkbox}>
                    {isSelected && <LiaCheckSolid />}
                  </div>
                  <span>{option.name || option.title || "Без назви"}</span>
                </button>
              );
            })}

            {loadingMore && (
              <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <span>Завантаження...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
