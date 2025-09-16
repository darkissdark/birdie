import { useState, useEffect, useCallback } from "react";
import { ApiEmotion } from "@/types/diary";
import { EmotionsService } from "@/services/emotionsService";

interface UseEmotionsState {
  emotions: ApiEmotion[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadingMore: boolean;
  page: number;
  total: number;
}

interface UseEmotionsReturn extends UseEmotionsState {
  loadMore: () => void;
  retry: () => void;
}

export const useEmotions = (pageSize: number = 10): UseEmotionsReturn => {
  const [state, setState] = useState<UseEmotionsState>({
    emotions: [],
    loading: true,
    error: null,
    hasMore: false,
    loadingMore: false,
    page: 1,
    total: 0,
  });

  const loadEmotions = useCallback(
    async (page: number, isLoadMore: boolean = false) => {
      setState((prev) => ({
        ...prev,
        loading: !isLoadMore,
        loadingMore: isLoadMore,
        error: null,
      }));

      try {
        const result = await EmotionsService.loadEmotions({
          page,
          limit: pageSize,
        });

        setState((prev) => ({
          ...prev,
          emotions: isLoadMore
            ? [...prev.emotions, ...result.emotions]
            : result.emotions,
          hasMore: result.hasMore,
          total: result.total,
          page: page,
          loading: false,
          loadingMore: false,
          error: null,
        }));
      } catch (error) {
        const errorMessage = EmotionsService.getErrorMessage(error);

        setState((prev) => ({
          ...prev,
          loading: false,
          loadingMore: false,
          error: errorMessage,
        }));
      }
    },
    [pageSize]
  );

  const loadMore = useCallback(() => {
    if (state.hasMore && !state.loadingMore) {
      loadEmotions(state.page + 1, true);
    }
  }, [state.hasMore, state.loadingMore, state.page, loadEmotions]);

  const retry = useCallback(() => {
    loadEmotions(1, false);
  }, [loadEmotions]);

  useEffect(() => {
    loadEmotions(1, false);
  }, [loadEmotions]);

  return {
    ...state,
    loadMore,
    retry,
  };
};
