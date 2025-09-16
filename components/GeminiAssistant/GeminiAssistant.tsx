"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  GeminiAIService,
  AIResponse,
  UserContext,
} from "@/services/gemini-ai.service";
import useAuthStore from "@/lib/store/authStore";
import styles from "./GeminiAssistant.module.css";
import {
  RiAiGenerate,
  RiCloseLine,
  RiAdvertisementFill,
  RiEmotionHappyFill,
  RiParagraph,
} from "react-icons/ri";
import { TbBook2 } from "react-icons/tb";
import { BsCalendar2Event } from "react-icons/bs";
import { AddDiaryEntryModal } from "@/components/AddDiaryEntryModal/AddDiaryEntryModal";
import AddTaskModal from "@/components/AddTaskModal/AddTaskModal";
import AddTaskForm from "@/components/AddTaskForm/AddTaskForm";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

interface WeekInfo {
  curWeekToPregnant: number;
  daysBeforePregnant: number;
  babyToday: {
    babySize: number;
    babyWeight: number;
    babyActivity: string;
    babyDevelopment: string;
    image: string;
  };
  momHint: string;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}

export const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [activeTab, setActiveTab] = useState<
    "chat" | "insights" | "reminders" | "diary" | "tasks"
  >("chat");
  const [isInitialized, setIsInitialized] = useState(false);

  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [weekInfo, setWeekInfo] = useState<WeekInfo | null>(null);

  // Dragging state
  const [position, setPosition] = useState({ x: 24, y: 80 });
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  const geminiService = useRef<GeminiAIService | null>(null);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!geminiService.current && GEMINI_API_KEY) {
      geminiService.current = new GeminiAIService(GEMINI_API_KEY);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (geminiService.current) {
      if (user && isAuthenticated) {
        fetchUserContext();
        fetchWeekInfo();
      } else {
        geminiService.current.updateUserContext(null);
        if (isInitialized && messages.length === 0) {
          generateWelcomeMessage();
        }
      }
    }
  }, [user, isAuthenticated, isInitialized]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Drag functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragState({
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialX: rect.left,
      initialY: rect.top,
    });
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect || !touch) return;

    setDragState({
      isDragging: true,
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: rect.left,
      initialY: rect.top,
    });
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging) return;

      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;

      const newX = Math.max(
        0,
        Math.min(window.innerWidth - 80, dragState.initialX + deltaX)
      );
      const newY = Math.max(
        0,
        Math.min(window.innerHeight - 80, dragState.initialY + deltaY)
      );

      setPosition({
        x: window.innerWidth - newX - 80, // Convert to right position for CSS
        y: window.innerHeight - newY - 80, // Convert to bottom position for CSS
      });
    },
    [dragState]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!dragState.isDragging) return;

      const touch = e.touches[0];
      if (!touch) return;

      const deltaX = touch.clientX - dragState.startX;
      const deltaY = touch.clientY - dragState.startY;

      const newX = Math.max(
        0,
        Math.min(window.innerWidth - 80, dragState.initialX + deltaX)
      );
      const newY = Math.max(
        0,
        Math.min(window.innerHeight - 80, dragState.initialY + deltaY)
      );

      setPosition({
        x: window.innerWidth - newX - 80,
        y: window.innerHeight - newY - 80,
      });
    },
    [dragState]
  );

  const handleMouseUp = useCallback(() => {
    setDragState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleTouchEnd = useCallback(() => {
    setDragState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [
    dragState.isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  const fetchWeekInfo = async () => {
    try {
      const axiosInstance = (await import("@/lib/axios")).default;
      const response = await axiosInstance.get("/weeks/greeting");
      setWeekInfo(response.data);
    } catch (error) {
      console.log("Помилка завантаження інформації про тиждень:", error);
    }
  };

  const fetchUserContext = async () => {
    if (!user || !geminiService.current) return;

    try {
      const axiosInstance = (await import("@/lib/axios")).default;
      const context: UserContext = {
        userId: user.id,
        name: user.name,
        email: user.email,
        dueDate: user.dueDate,
        babyGender: user.babyGender as "boy" | "girl" | "unknown",
      };

      try {
        const [emotionsRes, tasksRes, diaryRes] = await Promise.all([
          axiosInstance
            .get("/emotions?limit=20")
            .catch(() => ({ data: { emotions: [] } })),
          axiosInstance
            .get("/tasks?limit=10")
            .catch(() => ({ data: { tasks: [] } })),
          axiosInstance
            .get("/diary?limit=10")
            .catch(() => ({ data: { entries: [] } })),
        ]);

        context.emotions = emotionsRes.data.emotions || [];
        context.tasks = tasksRes.data.tasks || [];
        context.diaryEntries =
          diaryRes.data.entries || diaryRes.data.tasks || [];
      } catch (error) {
        console.log("Додаткові дані недоступні, працюємо з базовим контекстом");
      }

      geminiService.current.updateUserContext(context);

      if (messages.length === 0) {
        generateWelcomeMessage();
      }
    } catch (error) {
      console.error("Помилка завантаження контексту:", error);
    }
  };

  const generateWelcomeMessage = async () => {
    if (!geminiService.current) return;

    setIsLoading(true);
    try {
      let welcomeContent = "";

      if (isAuthenticated && weekInfo) {
        welcomeContent = `Привіт, ${user?.name || "мамо"}! 

Ти на ${weekInfo.curWeekToPregnant} тижні вагітності
До зустрічі з малюком залишилось ${weekInfo.daysBeforePregnant} днів!

${weekInfo.momHint}

Як справи? Чим можу допомогти?`;
      } else {
        welcomeContent = isAuthenticated
          ? `Привіт, ${user?.name || "майбутня мамо"}! 

Я твій AI-помічник з питань вагітності та материнства. Ставте будь-які питання!`
          : "Привіт! Я AI-помічник з питань вагітності та материнства. Ставте будь-які питання про вагітність, підготовку до пологів або догляд за малюком!";
      }

      setMessages([
        {
          content: welcomeContent,
          suggestions: [
            "Розкажи про цей тиждень вагітності",
            "Які вітаміни важливі?",
            "Як впоратися з токсикозом?",
          ],
          timestamp: new Date(),
          type: "general",
        },
      ]);
    } catch (error) {
      console.error("Помилка генерації привітання:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !geminiService.current) return;

    setIsLoading(true);
    try {
      const response = await geminiService.current.freeConversation(userInput);
      setMessages((prev) => [...prev, response]);
      setUserInput("");
    } catch (error) {
      console.error("Помилка відправки повідомлення:", error);
      setMessages((prev) => [
        ...prev,
        {
          content:
            "Вибачте, сталася помилка. Спробуйте ще раз або переформулюйте питання.",
          timestamp: new Date(),
          type: "general",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiarySuccess = () => {
    setShowDiaryModal(false);
    setMessages((prev) => [
      ...prev,
      {
        content: "Запис успішно додано до щоденника!",
        timestamp: new Date(),
        type: "general",
      },
    ]);
    fetchUserContext();
  };

  const handleTaskSuccess = () => {
    setShowTaskModal(false);
    setMessages((prev) => [
      ...prev,
      {
        content: "Завдання успішно створено!",
        timestamp: new Date(),
        type: "general",
      },
    ]);
    fetchUserContext();
  };

  const handleGenerateInsights = async () => {
    if (!geminiService.current) return;

    setIsLoading(true);
    try {
      const response = await geminiService.current.analyzeJournalInsights();
      setMessages((prev) => [...prev, response]);
      setActiveTab("insights");
    } catch (error) {
      console.error("Помилка генерації інсайтів:", error);
      const fallbackResponse = {
        content:
          "Для аналізу ваших інсайтів потрібно більше записів у щоденнику. Спробуйте додати кілька записів про ваші відчуття та емоції, а потім поверніться сюди!",
        timestamp: new Date(),
        type: "insight" as const,
        suggestions: [
          "Додати запис у щоденник",
          "Розкажи про емоційне здоров'я",
        ],
      };
      setMessages((prev) => [...prev, fallbackResponse]);
      setActiveTab("insights");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReminders = async () => {
    if (!geminiService.current) return;

    setIsLoading(true);
    try {
      const response = await geminiService.current.generateDailyReminders();
      setMessages((prev) => [...prev, response]);
      setActiveTab("reminders");
    } catch (error) {
      console.error("Помилка генерації нагадувань:", error);
      const fallbackResponse = {
        content:
          "Щоденні нагадування:\n\n• Не забувайте пити достатньо води\n• Приділіть 15 хвилин легким вправам\n• З'їжте порцію свіжих фруктів\n• Зробіть дихальні вправи для релаксації\n\nПам'ятайте: кожен день - це крок до зустрічі з малюком!",
        timestamp: new Date(),
        type: "reminder" as const,
      };
      setMessages((prev) => [...prev, fallbackResponse]);
      setActiveTab("reminders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (suggestion: string) => {
    setUserInput(suggestion);
    setTimeout(() => {
      const button = document.querySelector(
        `.${styles.sendButton}`
      ) as HTMLButtonElement;
      button?.click();
    }, 100);
  };

  const renderMessageIcon = (type: AIResponse["type"]) => {
    switch (type) {
      case "advice":
        return <RiAdvertisementFill />;
      case "reminder":
        return <BsCalendar2Event />;
      case "insight":
        return <RiParagraph />;
      case "motivation":
        return <RiEmotionHappyFill />;
      case "general":
        return <RiAiGenerate />;
      default:
        return <RiAiGenerate />;
    }
  };

  const renderTabContent = () => {
    if (activeTab === "diary") {
      return (
        <div className={styles.messagesArea}>
          <div className={styles.emptyState}>
            <p>
              <TbBook2 /> Щоденник вагітності
            </p>
            <p>Записуйте своє відчуття, емоції та важливі моменти</p>
            <button
              className={styles.quickReplyButton}
              onClick={() => setShowDiaryModal(true)}
            >
              Додати новий запис
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === "tasks") {
      return (
        <div className={styles.messagesArea}>
          <div className={styles.emptyState}>
            <p>Завдання</p>
            <p>Плануйте та відстежуйте важливі справи</p>
            <button
              className={styles.quickReplyButton}
              onClick={() => setShowTaskModal(true)}
              style={{ marginTop: "16px" }}
            >
              Додати нове завдання
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  if (!GEMINI_API_KEY) {
    return null;
  }

  const handleButtonClick = () => {
    if (!dragState.isDragging) {
      setIsOpen(true);
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        className={`${styles.floatingButton} ${dragState.isDragging ? styles.dragging : ""}`}
        style={{
          right: `${position.x}px`,
          bottom: `${position.y}px`,
          cursor: dragState.isDragging ? "grabbing" : "grab",
        }}
        onClick={handleButtonClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        aria-label="Відкрити AI асистента"
      >
        <span className={styles.buttonIcon}>
          <RiAiGenerate />
        </span>
        <span className={styles.buttonText}>AI Помічник</span>
      </button>

      {isOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.header}>
              <div className={styles.titleContainer}>
                <h2 className={styles.title}>
                  {isAuthenticated
                    ? `AI Помічник для ${user?.name || "майбутньої мами"}`
                    : "AI Помічник з питань материнства"}
                </h2>
                <div
                  className={styles.betaBadge}
                  title="Функція в розробці та постійно покращується. Ваші відгуки допомагають нам стати кращими!"
                >
                  <span className={styles.betaText}>BETA</span>
                  <div className={styles.betaGlow}></div>
                </div>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="Закрити"
              >
                <RiCloseLine />
              </button>
            </div>

            <div className={styles.tabs}>
              {[
                { key: "chat", label: "Чат" },
                { key: "insights", label: "Інсайти" },
                { key: "reminders", label: "Нагадування" },
                ...(isAuthenticated
                  ? [
                      { key: "diary", label: "Щоденник" },
                      { key: "tasks", label: "Завдання" },
                    ]
                  : []),
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ""}`}
                  onClick={() => {
                    if (tab.key === "insights") {
                      handleGenerateInsights();
                    } else if (tab.key === "reminders") {
                      handleGenerateReminders();
                    } else {
                      setActiveTab(tab.key as typeof activeTab);
                    }
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {(activeTab === "diary" || activeTab === "tasks") &&
            isAuthenticated ? (
              renderTabContent()
            ) : (
              <div className={styles.messagesArea}>
                {messages.length === 0 && !isLoading && (
                  <div className={styles.emptyState}>
                    <p>Привіт! {user?.name}</p>
                    <p>Я ваш AI-помічник з питань вагітності та материнства.</p>
                    <p>Ставте будь-які питання!</p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div key={index} className={styles.message}>
                    <div className={styles.messageHeader}>
                      <span className={styles.messageIcon}>
                        {renderMessageIcon(message.type)}
                      </span>
                      <span className={styles.messageTime}>
                        {new Date(message.timestamp).toLocaleTimeString(
                          "uk-UA",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                    <div className={styles.messageContent}>
                      {message.content}
                    </div>
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className={styles.suggestions}>
                        {activeTab === "chat" ? (
                          <div className={styles.quickReplies}>
                            {message.suggestions
                              .slice(0, 3)
                              .map((suggestion, idx) => (
                                <button
                                  key={idx}
                                  className={styles.quickReplyButton}
                                  onClick={() => handleQuickReply(suggestion)}
                                >
                                  {suggestion}
                                </button>
                              ))}
                          </div>
                        ) : (
                          message.suggestions.map((suggestion, idx) => (
                            <div key={idx} className={styles.suggestion}>
                              {suggestion}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                    {message.relatedTopics &&
                      message.relatedTopics.length > 0 && (
                        <div className={styles.relatedTopics}>
                          <span className={styles.topicsLabel}>
                            Схожі теми:
                          </span>
                          {message.relatedTopics.map((topic, idx) => (
                            <span key={idx} className={styles.topicChip}>
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                ))}

                {isLoading && (
                  <div className={styles.loadingMessage}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>AI думає...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {activeTab === "chat" && (
              <div className={styles.inputArea}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={
                    isAuthenticated
                      ? "Задайте питання про вашу вагітність..."
                      : "Задайте питання про вагітність або материнство..."
                  }
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading}
                />
                <button
                  className={styles.sendButton}
                  onClick={handleSendMessage}
                  disabled={isLoading || !userInput.trim()}
                >
                  Надіслати
                </button>
              </div>
            )}

            {!isAuthenticated && activeTab === "chat" && (
              <div className={styles.guestHint}>
                Увійдіть в систему для персоналізованих порад
              </div>
            )}
          </div>
        </div>
      )}

      <AddDiaryEntryModal
        isOpen={showDiaryModal}
        onClose={() => setShowDiaryModal(false)}
        onSuccess={handleDiarySuccess}
      />

      {showTaskModal && (
        <AddTaskModal closeModal={() => setShowTaskModal(false)}>
          <AddTaskForm onClose={handleTaskSuccess} />
        </AddTaskModal>
      )}
    </>
  );
};
