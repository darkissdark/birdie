import { GoogleGenerativeAI } from "@google/generative-ai";

export interface UserContext {
  userId?: string;
  name?: string;
  email?: string;
  dueDate?: string;
  babyGender?: "boy" | "girl" | "unknown";
  currentWeek?: number;
  daysBeforePregnant?: number;
  weekInfo?: {
    babySize?: number;
    babyWeight?: number;
    babyActivity?: string;
    babyDevelopment?: string;
    momHint?: string;
  };
  emotions?: Array<{
    _id: string;
    name: string;
    date?: string;
  }>;
  tasks?: Array<{
    _id?: string;
    name: string;
    isDone: boolean;
    date: string;
  }>;
  diaryEntries?: Array<{
    _id?: string;
    title: string;
    description: string;
    emotions: Array<{ _id: string; name?: string }> | string[];
    date: string;
  }>;
}

export interface AIResponse {
  content: string;
  suggestions?: string[];
  relatedTopics?: string[];
  timestamp: Date;
  contextUsed?: Partial<UserContext>;
  type: "advice" | "reminder" | "insight" | "motivation" | "general";
}

export class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private userContext: UserContext | null = null;
  private isAuthenticated: boolean = false;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  public updateUserContext(context: UserContext | null): void {
    this.userContext = context;
    this.isAuthenticated = !!context?.userId;
  }

  private calculatePregnancyWeek(dueDate?: string): number {
    if (!dueDate) return 20;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeksRemaining = Math.floor(diffDays / 7);
    return Math.max(1, Math.min(40, 40 - weeksRemaining));
  }

  private analyzeEmotionalState(): string {
    if (!this.userContext?.emotions || this.userContext.emotions.length === 0) {
      return "нейтральний";
    }

    const recentEmotions = this.userContext.emotions.slice(-7);
    const emotionFrequency: Record<string, number> = {};

    recentEmotions.forEach((emotion) => {
      emotionFrequency[emotion.name] =
        (emotionFrequency[emotion.name] || 0) + 1;
    });

    const dominantEmotion = Object.entries(emotionFrequency).sort(
      ([, a], [, b]) => b - a
    )[0];

    return dominantEmotion ? dominantEmotion[0] : "нейтральний";
  }

  private getContextualInfo(): string {
    if (!this.isAuthenticated || !this.userContext) {
      return "Користувачка цікавиться темою материнства та вагітності.";
    }

    const currentWeek =
      this.userContext.currentWeek ||
      this.calculatePregnancyWeek(this.userContext.dueDate);

    let contextInfo = `Користувачка ${this.userContext.name} на ${currentWeek} тижні вагітності.`;

    if (this.userContext.weekInfo?.momHint) {
      contextInfo += ` Поточні рекомендації: ${this.userContext.weekInfo.momHint}`;
    }

    if (this.userContext.tasks && this.userContext.tasks.length > 0) {
      const incompleteTasks = this.userContext.tasks.filter((t) => !t.isDone);
      if (incompleteTasks.length > 0) {
        contextInfo += ` Незавершені завдання: ${incompleteTasks
          .map((t) => t.name)
          .slice(0, 3)
          .join(", ")}.`;
      }
    }

    const emotionalState = this.analyzeEmotionalState();
    if (emotionalState !== "нейтральний") {
      contextInfo += ` Поточний емоційний стан: ${emotionalState}.`;
    }

    return contextInfo;
  }

  public async freeConversation(message: string): Promise<AIResponse> {
    const contextInfo = this.getContextualInfo();

    const prompt = `
      Ти - досвідчений консультант з питань материнства та вагітності, який надає 
      коротку, корисну підтримку та конкретні поради майбутнім мамам.
      
      ${contextInfo}
      
      Повідомлення від користувачки: ${message}
      
      Дай коротку (максимум 150 слів), тепру та практичну відповідь українською мовою.
      Якщо питання стосується:
      - Медичних аспектів - дай загальну інформацію та порекомендуй консультацію з лікарем
      - Емоційного стану - запропонуй техніки підтримки
      - Підготовки до материнства - дай практичні поради
      - Догляду за дитиною - поділись корисними порадами
      
      Твоя відповідь має бути:
      1. Емпатичною та підтримуючою
      2. Практичною та корисною
      3. Безпечною (завжди рекомендуй консультацію з лікарем для медичних питань)
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        content: text,
        suggestions: this.generateQuickReplies(),
        relatedTopics: this.generateGeneralTopics(),
        timestamp: new Date(),
        contextUsed: this.isAuthenticated
          ? {
              name: this.userContext?.name,
              currentWeek: this.userContext?.currentWeek,
            }
          : undefined,
        type: "general",
      };
    } catch (error) {
      console.error("Помилка вільної бесіди:", error);
      throw error;
    }
  }

  public async generateWelcomeForGuest(): Promise<AIResponse> {
    const prompt = `
      Створи коротке привітальне повідомлення (максимум 80 слів) для користувачки, яка цікавиться 
      темою материнства та вагітності. 
      
      Українською мовою напиши:
      1. Привітання
      2. Коротко про те, чим ти можеш допомогти
      3. Запрошення поставити питання
      
      Тон: теплий, дружній, підтримуючий.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        content: text,
        suggestions: [
          "Розкажи про перший триместр",
          "Які вітаміни важливі?",
          "Як впоратися з токсикозом?",
          "Підготовка до пологів",
          "Догляд за новонародженим",
        ],
        relatedTopics: this.generateGeneralTopics(),
        timestamp: new Date(),
        type: "general",
      };
    } catch (error) {
      console.error("Помилка генерації привітання:", error);
      throw error;
    }
  }

  public async generatePersonalizedAdvice(): Promise<AIResponse> {
    if (!this.userContext || !this.isAuthenticated) {
      return this.generateWelcomeForGuest();
    }

    const currentWeek =
      this.userContext.currentWeek ||
      this.calculatePregnancyWeek(this.userContext.dueDate);
    const emotionalState = this.analyzeEmotionalState();

    const prompt = `
      Ти - експертний помічник для вагітних жінок. Користувачка ${this.userContext.name || "майбутна мама"} 
      знаходиться на ${currentWeek} тижні вагітності.
      
      Інформація про користувачку:
      - Стать дитини: ${
        this.userContext.babyGender === "boy"
          ? "хлопчик"
          : this.userContext.babyGender === "girl"
            ? "дівчинка"
            : "ще не відомо"
      }
      - Поточний емоційний стан: ${emotionalState}
      - Термін пологів: ${this.userContext.dueDate || "не вказано"}
      ${this.userContext.weekInfo?.momHint ? `- Рекомендації тижня: ${this.userContext.weekInfo.momHint}` : ""}
      
      Створи коротку персоналізовану пораду (максимум 120 слів) українською мовою:
      1. Привітання з ім'ям
      2. Рекомендацію для ${currentWeek} тижня вагітності
      3. Поради щодо емоційного стану
      4. Корисні вправи або активності
      
      Відповідь має бути теплою, підтримуючою та інформативною.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        content: text,
        suggestions: this.extractSuggestions(text),
        relatedTopics: this.generateRelatedTopics(currentWeek),
        timestamp: new Date(),
        contextUsed: {
          currentWeek,
          babyGender: this.userContext.babyGender,
          name: this.userContext.name,
        },
        type: "advice",
      };
    } catch (error) {
      console.error("Помилка генерації поради:", error);
      throw error;
    }
  }

  public async generateDailyReminders(): Promise<AIResponse> {
    if (!this.userContext || !this.isAuthenticated) {
      return {
        content: ` Щоденні нагадування для майбутньої мами:

• Не забувайте пити достатньо води - мінімум 8 склянок на день
• Приділіть 15 хвилин легким вправам або прогулянці
• З'їжте порцію свіжих фруктів або овочів
• Зробіть дихальні вправи для релаксації
• Запишіть свої думки та відчуття в щоденник

Пам'ятайте: кожен день вашої вагітності - це крок до зустрічі з малюком!`,
        suggestions: [
          "Розкажи більше про дихальні вправи",
          "Які фрукти найкориснiші?",
          "Скільки води потрібно пити?",
        ],
        timestamp: new Date(),
        type: "reminder",
      };
    }

    const incompleteTasks =
      this.userContext.tasks?.filter((t) => !t.isDone) || [];
    const currentWeek =
      this.userContext.currentWeek ||
      this.calculatePregnancyWeek(this.userContext.dueDate);

    const prompt = `
      Створи короткі мотиваційні нагадування для вагітної жінки на ${currentWeek} тижні.
      
      Незавершені завдання: ${incompleteTasks.map((t) => t.name).join(", ") || "немає"}
      
      Згенеруй 4-5 коротких нагадувань українською мовою про:
      - Важливість виконання медичних призначень
      - Здорове харчування
      - Фізичну активність
      - Емоційне благополуччя
      ${incompleteTasks.length > 0 ? "- Завершення поточних завдань" : ""}
      
      Кожне нагадування - одне речення. Тон мотиваційний та підтримуючий.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        content: text,
        suggestions: text
          .split("\n")
          .filter((s: string) => s.trim())
          .slice(0, 3),
        timestamp: new Date(),
        contextUsed: {
          currentWeek,
          tasks: this.userContext.tasks,
        },
        type: "reminder",
      };
    } catch (error) {
      console.error("Помилка генерації нагадувань:", error);
      throw error;
    }
  }

  public async analyzeJournalInsights(): Promise<AIResponse> {
    if (
      !this.userContext?.diaryEntries ||
      this.userContext.diaryEntries.length === 0
    ) {
      return {
        content: `Для аналізу ваших інсайтів потрібно більше записів у щоденнику.

Ведення щоденника вагітності допомагає:
• Відстежувати емоційні зміни та настрій
• Зберегти спогади про цей особливий період  
• Краще розуміти свої почуття та потреби
• Помічати патерни та тригери емоцій
• Ділитися досвідом з партнером або лікарем

Спробуйте записувати:
- Фізичні відчуття та зміни
- Емоції та переживання
- Перші рухи малюка
- Важливі моменти та думки
- Питання для лікаря`,
        suggestions: [
          "Про що писати в щоденнику?",
          "Як часто вести записи?",
          "Які емоції нормальні під час вагітності?",
        ],
        relatedTopics: ["емоційне здоров'я", "ведення щоденника", "самоаналіз"],
        timestamp: new Date(),
        type: "insight",
      };
    }

    const recentEntries = this.userContext.diaryEntries.slice(-7);

    const prompt = `
      Проаналізуй емоційний стан вагітної жінки на основі її щоденникових записів.
      
      Останні записи:
      ${recentEntries
        .map((entry) => {
          const emotions = Array.isArray(entry.emotions)
            ? entry.emotions
                .map((e) => (typeof e === "string" ? e : e.name || e._id))
                .join(", ")
            : "не вказано";
          return `${entry.date}: ${entry.title} - Емоції: ${emotions}`;
        })
        .join("\n")}
      
      Надай українською мовою (максимум 120 слів):
      1. Короткий аналіз емоційного стану (2-3 речення)
      2. Рекомендації для покращення самопочуття
      3. Техніки релаксації або mindfulness вправи
      
      Тон має бути підтримуючим та емпатичним.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        content: text,
        relatedTopics: [
          "емоційне здоров'я",
          "техніки релаксації",
          "mindfulness",
        ],
        timestamp: new Date(),
        contextUsed: {
          diaryEntries: recentEntries,
        },
        type: "insight",
      };
    } catch (error) {
      console.error("Помилка аналізу щоденника:", error);
      throw error;
    }
  }

  public async answerQuestion(question: string): Promise<AIResponse> {
    return this.freeConversation(question);
  }

  private extractSuggestions(text: string): string[] {
    const lines = text.split("\n").filter((line) => line.trim());
    const suggestions = lines
      .filter((line) => line.match(/^\d+\.|^-|^•/))
      .map((line) => line.replace(/^\d+\.|^-|^•/, "").trim())
      .slice(0, 5);
    return suggestions.length > 0 ? suggestions : this.generateQuickReplies();
  }

  private generateQuickReplies(): string[] {
    const generalQuestions = [
      "Які вітаміни важливі під час вагітності?",
      "Як впоратися з ранковою нудотою?",
      "Які вправи безпечні для вагітних?",
      "Як підготуватися до пологів?",
      "Що взяти в пологовий будинок?",
      "Як зменшити набряки?",
      "Що робити при безсонні?",
      "Які аналізи потрібно здавати?",
    ];

    const shuffled = generalQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 3);
  }

  private generateGeneralTopics(): string[] {
    return [
      "Харчування під час вагітності",
      "Фізичні вправи для вагітних",
      "Підготовка до пологів",
      "Догляд за новонародженим",
      "Емоційне здоров'я",
    ];
  }

  private generateRelatedTopics(week: number): string[] {
    const topics = [
      `Розвиток дитини на ${week} тижні`,
      "Підготовка до пологів",
      "Харчування під час вагітності",
      "Фізичні вправи для вагітних",
      "Емоційне здоров'я",
    ];

    if (week >= 28) {
      topics.push("Підготовка речей для пологового будинку");
    }
    if (week >= 35) {
      topics.push("Ознаки початку пологів");
    }

    return topics.slice(0, 5);
  }
}
