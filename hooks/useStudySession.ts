"use client";

import { StudySession, Flashcard } from "@/types/flashcard";
import { Id } from "@/convex/_generated/dataModel";
import { getCards } from "@/lib/webllm";
import { useStudyStore } from "@/store/useStudyStore";
import { useStudySessionMutations } from "./useStudySessionMutations";
import { useCallback, useEffect } from "react";

/**
 * Hook for managing study session business logic
 * Uses Zustand for state management and mutations hook for persistence
 */
export function useStudySession() {
  const studySessions = useStudyStore((state) => state.studySessions);
  const currentSession = useStudyStore((state) => state.currentSession);
  const currentCardIndex = useStudyStore((state) => state.currentCardIndex);
  const setCurrentSession = useStudyStore((state) => state.setCurrentSession);
  const setCurrentCardIndex = useStudyStore(
    (state) => state.setCurrentCardIndex,
  );

  const {
    createSession,
    updateSession,
    deleteSession: deleteSessionMutation,
  } = useStudySessionMutations();

  /**
   * Generate flashcards using AI
   */
  const generateFlashcards = useCallback(
    async (topic: string, count: number): Promise<Flashcard[]> => {
      const response = await getCards(topic, count);
      if (!response) return [];
      const cards = JSON.parse(response) as Flashcard[];
      return cards;
    },
    [],
  );

  /**
   * Create a new study session
   */
  const createStudySession = useCallback(
    async (topic: string, numCards: number) => {
      const cards = await generateFlashcards(topic, numCards);
      const newStudySession: Omit<StudySession, "_id" | "createdAt"> = {
        topic,
        totalCards: numCards,
        cards,
        completedCards: 0,
        correctAnswers: 0,
      };

      const sessionWithId = await createSession(newStudySession);
      setCurrentSession(sessionWithId);
      setCurrentCardIndex(0);
    },
    [generateFlashcards, createSession, setCurrentSession, setCurrentCardIndex],
  );

  /**
   * Mark a card as correct or incorrect
   * Updates count only on first answer, allows changing answer with proper count adjustment
   */
  const markCard = useCallback(
    (isCorrect: boolean) => {
      if (!currentSession || !currentSession._id) return;

      const currentCard = currentSession.cards[currentCardIndex];
      const wasAlreadyAnswered = currentCard.answeredCorrect !== undefined;
      const previousAnswerWasCorrect = currentCard.answeredCorrect === true;

      const updatedCards = [...currentSession.cards];
      updatedCards[currentCardIndex] = {
        ...updatedCards[currentCardIndex],
        answeredCorrect: isCorrect,
      };

      // Calculate changes to counts
      const completedCardsChange = wasAlreadyAnswered ? 0 : 1;
      let correctAnswersChange = 0;

      if (!wasAlreadyAnswered) {
        correctAnswersChange = isCorrect ? 1 : 0;
      } else if (previousAnswerWasCorrect !== isCorrect) {
        if (isCorrect) {
          correctAnswersChange = 1; // Changed from incorrect to correct
        } else {
          correctAnswersChange = -1; // Changed from correct to incorrect
        }
      }

      const updatedSession: StudySession = {
        ...currentSession,
        cards: updatedCards,
        completedCards: currentSession.completedCards + completedCardsChange,
        correctAnswers: currentSession.correctAnswers + correctAnswersChange,
      };

      // Optimistically update in store and trigger auto-save
      setCurrentSession(updatedSession);
      updateSession(currentSession._id, {
        cards: updatedCards,
        completedCards: updatedSession.completedCards,
        correctAnswers: updatedSession.correctAnswers,
      });

      // Move to next card
      if (currentCardIndex < currentSession.cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      }
    },
    [
      currentSession,
      currentCardIndex,
      setCurrentSession,
      setCurrentCardIndex,
      updateSession,
    ],
  );

  /**
   * Navigate to previous or next card
   */
  const navigateCard = useCallback(
    (direction: "prev" | "next") => {
      if (!currentSession) return;

      const newIndex =
        direction === "prev"
          ? Math.max(0, currentCardIndex - 1)
          : Math.min(currentSession.cards.length - 1, currentCardIndex + 1);

      setCurrentCardIndex(newIndex);
    },
    [currentSession, currentCardIndex, setCurrentCardIndex],
  );

  /**
   * Complete the current study session
   */
  const completeSession = useCallback(() => {
    setCurrentSession(null);
    setCurrentCardIndex(0);
  }, [setCurrentSession, setCurrentCardIndex]);

  /**
   * Resume a study session
   */
  const resumeSession = useCallback(
    (session: StudySession) => {
      setCurrentSession(session);
      setCurrentCardIndex(0);
    },
    [setCurrentSession, setCurrentCardIndex],
  );

  /**
   * Delete a study session
   */
  const deleteSession = useCallback(
    async (sessionId: Id<"studySessions">) => {
      await deleteSessionMutation(sessionId);
    },
    [deleteSessionMutation],
  );

  // Cleanup: Save current session when component unmounts or session changes
  useEffect(() => {
    return () => {
      // This will be called when the component unmounts
      // The debounced save in mutations hook handles persistence
    };
  }, [currentSession]);

  return {
    studySessions,
    currentSession,
    currentCardIndex,
    createStudySession,
    markCard,
    navigateCard,
    completeSession,
    resumeSession,
    deleteSession,
  };
}
