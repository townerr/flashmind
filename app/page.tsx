"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import FlashcardStudy from "@/components/FlashcardStudy";
import WelcomeScreen from "@/components/WelcomeScreen";
import { StudySession, Flashcard } from "@/types/flashcard";

export default function Home() {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const generateFlashcards = async (topic: string, count: number): Promise<Flashcard[]> => {
    // Mock data for demonstration - in real app, this would call AI API
    const mockCards: Flashcard[] = [];
    for (let i = 1; i <= count; i++) {
      mockCards.push({
        id: `${topic}-${i}`,
        question: `What is the main concept of ${topic} in question ${i}?`,
        answer: `This is the detailed answer for ${topic} question ${i}. It explains the key concepts and provides comprehensive information about the topic.`
      });
    }
    return mockCards;
  };

  const createStudySession = async (topic: string, numCards: number) => {
    const cards = await generateFlashcards(topic, numCards);
    const newSession: StudySession = {
      id: Date.now().toString(),
      topic,
      totalCards: numCards,
      cards,
      completedCards: 0,
      correctAnswers: 0,
      createdAt: new Date()
    };
    
    setStudySessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
    setCurrentCardIndex(0);
  };

  const markCard = (isCorrect: boolean) => {
    if (!currentSession) return;
    
    const updatedCards = [...currentSession.cards];
    updatedCards[currentCardIndex] = {
      ...updatedCards[currentCardIndex],
      isCorrect
    };
    
    const updatedSession = {
      ...currentSession,
      cards: updatedCards,
      completedCards: currentSession.completedCards + 1,
      correctAnswers: currentSession.correctAnswers + (isCorrect ? 1 : 0)
    };
    
    setCurrentSession(updatedSession);
    setStudySessions(prev => 
      prev.map(session => session.id === updatedSession.id ? updatedSession : session)
    );
    
    // Move to next card
    if (currentCardIndex < currentSession.cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const navigateCard = (direction: 'prev' | 'next') => {
    if (!currentSession) return;
    
    const newIndex = direction === 'prev' 
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex h-screen">
        <Sidebar 
          studySessions={studySessions}
          currentSessionId={currentSession?.id}
          onCreateSession={createStudySession}
          onResumeSession={resumeSession}
        />

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {currentSession ? (
            <FlashcardStudy
              session={currentSession}
              onMarkCard={markCard}
              onNavigateCard={navigateCard}
              onCompleteSession={completeSession}
              currentCardIndex={currentCardIndex}
            />
          ) : (
            <WelcomeScreen />
          )}
        </div>
      </div>
    </div>
  );
}

