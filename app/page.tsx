"use client";

import Sidebar from "@/components/Sidebar";
import FlashcardStudy from "@/components/FlashcardStudy";
import WelcomeScreen from "@/components/WelcomeScreen";
import { useStudySession } from "@/hooks/useStudySession";
import { useStudyStore } from "@/store/useStudyStore";
import { useUserStore } from "@/store/useUserStore";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { initializeEngine } from "@/lib/webllm";

export default function Home() {
  const {
    studySessions,
    currentSession,
    currentCardIndex,
    createStudySession,
    markCard,
    navigateCard,
    completeSession,
    resumeSession,
    deleteSession,
  } = useStudySession();

  // Query user's data and setup state
  const user = useQuery(api.userApi.getCurrentUser);
  const sessions = useQuery(api.userApi.getUserStudySessions);
  const setStudySessions = useStudyStore((state) => state.setStudySessions);
  const setInitComplete = useStudyStore((state) => state.setInitComplete);
  const initComplete = useStudyStore((state) => state.initComplete);
  const setUser = useUserStore((state) => state.setUser);

  // Initialize webllm ai engine
  useEffect(() => {
    async function handleInitialize() {
      await initializeEngine();
      console.log("Engine initialized");
      setInitComplete(true);
    }

    handleInitialize();
  }, [setInitComplete]);

  // Sync sessions from Convex to Zustand store
  useEffect(() => {
    if (sessions) {
      const mappedSessions = sessions.map((session) => ({
        _id: session._id,
        topic: session.topic,
        totalCards: session.totalCards,
        cards: session.cards.map((card) => ({
          id: card.id || "",
          question: card.question,
          answer: card.answer,
          answeredCorrect: card.answeredCorrect,
        })),
        completedCards: session.completedCards,
        correctAnswers: session.correctAnswers,
      }));
      setStudySessions(mappedSessions);
    }
  }, [sessions, setStudySessions]);

  // Sync user data from Convex to Zustand store
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="flex h-[calc(100vh-5rem)]">
        <Sidebar
          studySessions={studySessions}
          currentSessionId={currentSession?._id || ""}
          onCreateSession={createStudySession}
          onResumeSession={resumeSession}
          onDeleteSession={deleteSession}
          initComplete={initComplete}
        />

        <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-hidden">
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