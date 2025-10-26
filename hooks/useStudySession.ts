"use client";

import { useState } from "react";
import { StudySession, Flashcard } from "@/types/flashcard";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useStudySession() {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(
    null,
  );
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const saveStudySession = useMutation(api.userApi.createUserStudySession);

  const generateFlashcards = async (
    topic: string,
    count: number,
  ): Promise<Flashcard[]> => {
    // Mock data for demonstration - in real app, this would call AI API
    const mockCards: Flashcard[] = [];
    for (let i = 1; i <= count; i++) {
      mockCards.push({
        id: `${topic}-${i}`,
        question: `What is the main concept of ${topic} in question ${i}?`,
        answer: `This is the detailed answer for ${topic} question ${i}. It explains the key concepts and provides comprehensive information about the topic.`,
      });
    }
    return mockCards;
  };

  const createStudySession = async (topic: string, numCards: number) => {
    const cards = await generateFlashcards(topic, numCards);
    const newStudySession: StudySession = {
      id: "",
      topic,
      totalCards: numCards,
      cards,
      completedCards: 0,
      correctAnswers: 0,
    };

    setStudySessions((prev) => [newStudySession, ...prev]);
    setCurrentSession(newStudySession);
    setCurrentCardIndex(0);

    //save to db
    await saveStudySession({
      studySession: {
        topic: newStudySession.topic,
        totalCards: newStudySession.totalCards,
        cards: newStudySession.cards,
        completedCards: newStudySession.completedCards,
        correctAnswers: newStudySession.correctAnswers,
      },
    });
  };

  const markCard = (isCorrect: boolean) => {
    if (!currentSession) return;

    const updatedCards = [...currentSession.cards];
    updatedCards[currentCardIndex] = {
      ...updatedCards[currentCardIndex],
      answeredCorrect: isCorrect,
    };

    const updatedSession = {
      ...currentSession,
      cards: updatedCards,
      completedCards: currentSession.completedCards + 1,
      correctAnswers: currentSession.correctAnswers + (isCorrect ? 1 : 0),
    };

    setCurrentSession(updatedSession);
    setStudySessions((prev) =>
      prev.map((session) =>
        session.id === updatedSession.id ? updatedSession : session,
      ),
    );

    // Move to next card
    if (currentCardIndex < currentSession.cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    }
  };

  const navigateCard = (direction: "prev" | "next") => {
    if (!currentSession) return;

    const newIndex =
      direction === "prev"
        ? Math.max(0, currentCardIndex - 1)
        : Math.min(currentSession.cards.length - 1, currentCardIndex + 1);

    setCurrentCardIndex(newIndex);
  };

  const completeSession = () => {
    setCurrentSession(null);
    setCurrentCardIndex(0);
  };

  const resumeSession = (session: StudySession) => {
    setCurrentSession(session);
    setCurrentCardIndex(0);
  };

  const deleteSession = (sessionId: string) => {
    setStudySessions((prev) => prev.filter((session) => session.id !== sessionId));
    
    // If the deleted session is the current session, clear it
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
      setCurrentCardIndex(0);
    }
  };

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
    setStudySessions,
  };
}
