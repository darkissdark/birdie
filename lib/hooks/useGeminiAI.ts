import { useState, useCallback, useRef, useEffect } from "react";
import {
  GeminiAIService,
  AIResponse,
  UserContext,
} from "@/services/gemini-ai.service";

export const useGeminiAI = (apiKey: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [responses, setResponses] = useState<AIResponse[]>([]);

  const serviceRef = useRef<GeminiAIService | null>(null);

  useEffect(() => {
    if (apiKey && !serviceRef.current) {
      serviceRef.current = new GeminiAIService(apiKey);
    }
  }, [apiKey]);

  const updateContext = useCallback((context: UserContext) => {
    serviceRef.current?.updateUserContext(context);
  }, []);

  const generateAdvice = useCallback(async () => {
    if (!serviceRef.current) return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await serviceRef.current.generatePersonalizedAdvice();
      setResponses((prev) => [...prev, response]);
      return response;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const askQuestion = useCallback(async (question: string) => {
    if (!serviceRef.current) return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await serviceRef.current.answerQuestion(question);
      setResponses((prev) => [...prev, response]);
      return response;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setResponses([]);
  }, []);

  return {
    isLoading,
    error,
    responses,
    updateContext,
    generateAdvice,
    askQuestion,
    clearHistory,
  };
};
