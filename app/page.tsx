"use client";

import Sidebar from "@/components/Sidebar";
import FlashcardStudy from "@/components/FlashcardStudy";
import WelcomeScreen from "@/components/WelcomeScreen";
import { useStudySession } from "@/hooks/useStudySession";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { StudySession } from "@/types/flashcard";
import { useEffect, useState } from "react";
import { initializeEngine } from "@/lib/webllm";

export default function Home() {
  const [initComplete, setInitComplete] = useState(false);
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
    setStudySessions,
  } = useStudySession();

  //init ai engine and query user's data
  const user = useQuery(api.userApi.getCurrentUser);
  const sessions = useQuery(api.userApi.getUserStudySessions);

  useEffect(() => {
    async function handleInitialize() {
      await initializeEngine();
      console.log("Engine initialized");
      setInitComplete(true);
    }

    handleInitialize();
  }, []);

  useEffect(() => {
    if (sessions) {
      setStudySessions(sessions as StudySession[]);
    }
  }, [sessions, setStudySessions]);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="flex h-[calc(100vh-5rem)]">
        <Sidebar
          studySessions={studySessions}
          currentSessionId={currentSession?._id}
          onCreateSession={createStudySession}
          onResumeSession={resumeSession}
          onDeleteSession={deleteSession}
          userName={user?.username ?? "Guest"}
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
