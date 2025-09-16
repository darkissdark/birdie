import api from "@/lib/axios";
import { ApiEmotion } from "@/types/diary";

interface EmotionsResponse {
  data?: ApiEmotion[];
  emotions?: ApiEmotion[];
  results?: ApiEmotion[];
  hasMore?: boolean;
  total?: number;
}

interface LoadEmotionsParams {
  page: number;
  limit: number;
}

export class EmotionsService {
  private static readonly FALLBACK_EMOTIONS: ApiEmotion[] = [
    { _id: "1", name: "Натхнення" },
    { _id: "2", name: "Вдячність" },
    { _id: "3", name: "Тривога" },
    { _id: "4", name: "Дивні бажання" },
    { _id: "5", name: "Нудота" },
  ];

  static async loadEmotions({ page, limit }: LoadEmotionsParams): Promise<{
    emotions: ApiEmotion[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      const response = await api.get(`/emotions?page=${page}&limit=${limit}`);

      let emotionsData: ApiEmotion[] = [];
      let total = 0;
      let hasMore = false;

      if (Array.isArray(response.data)) {
        emotionsData = response.data;
        total = emotionsData.length;
        hasMore = emotionsData.length === limit;
      } else if (response.data) {
        const data = response.data as EmotionsResponse;

        if (data.data && Array.isArray(data.data)) {
          emotionsData = data.data;
        } else if (data.emotions && Array.isArray(data.emotions)) {
          emotionsData = data.emotions;
        } else if (data.results && Array.isArray(data.results)) {
          emotionsData = data.results;
        }

        total = data.total || emotionsData.length;
        hasMore = data.hasMore ?? emotionsData.length === limit;
      }

      const validEmotions = emotionsData.filter(
        (emotion): emotion is ApiEmotion => {
          return (
            emotion &&
            typeof emotion._id === "string" &&
            emotion._id.length > 0 &&
            (typeof emotion.name === "string" ||
              typeof emotion.title === "string")
          );
        }
      );

      if (validEmotions.length === 0 && page === 1) {
        return {
          emotions: this.FALLBACK_EMOTIONS,
          hasMore: false,
          total: this.FALLBACK_EMOTIONS.length,
        };
      }

      return {
        emotions: validEmotions,
        hasMore,
        total,
      };
    } catch (error) {
      if (page === 1) {
        return {
          emotions: this.FALLBACK_EMOTIONS,
          hasMore: false,
          total: this.FALLBACK_EMOTIONS.length,
        };
      }

      throw error;
    }
  }

  static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          data?: { message?: string };
        };
        message?: string;
      };

      return (
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Помилка завантаження емоцій"
      );
    }

    return "Помилка завантаження емоцій";
  }
}
