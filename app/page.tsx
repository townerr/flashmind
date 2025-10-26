"use client";

import Sidebar from "@/components/Sidebar";
import FlashcardStudy from "@/components/FlashcardStudy";
import WelcomeScreen from "@/components/WelcomeScreen";
import { useStudySession } from "@/hooks/useStudySession";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

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
  } = useStudySession();

  const user = useQuery(api.myFunctions.getCurrentUserId);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="flex h-[calc(100vh-5rem)]">
        <Sidebar 
          studySessions={studySessions}
          currentSessionId={currentSession?.id}
          onCreateSession={createStudySession}
          onResumeSession={resumeSession}
          userName={user?.name ?? "Guest"}
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

