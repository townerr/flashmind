"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import FlashcardStudy from "@/components/FlashcardStudy";
import WelcomeScreen from "@/components/WelcomeScreen";
import { useStudySession } from "@/hooks/useStudySession";
import { useStudyStore } from "@/store/useStudyStore";
import { useUserStore } from "@/store/useUserStore";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Trash2 } from "lucide-react";
import { StudySession } from "@/types/flashcard";
import { Id } from "@/convex/_generated/dataModel";
import StudySessionModal from "@/components/StudySessionModal";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  const initComplete = useStudyStore((state) => state.initComplete);
  const setUser = useUserStore((state) => state.setUser);

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

  const handleResumeSession = (session: StudySession) => {
    resumeSession(session);
    setMobileMenuOpen(false);
  };

  const handleDeleteSession = (sessionId: Id<"studySessions">) => {
    deleteSession(sessionId);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="flex h-[calc(100vh-5rem)] relative">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar
            studySessions={studySessions}
            currentSessionId={currentSession?._id || ""}
            onCreateSession={createStudySession}
            onResumeSession={resumeSession}
            onDeleteSession={deleteSession}
            initComplete={initComplete}
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden absolute top-4 left-4 z-10">
          <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72 max-h-[80vh] overflow-y-auto bg-white">
              <div className="p-2">
                {/* Create New Session */}
                <div className="mb-4">
                  <StudySessionModal
                    onCreateSession={createStudySession}
                    isLoading={!initComplete}
                  />
                </div>
                
                {/* Study Sessions List */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 px-3">
                    Study Decks
                  </h3>
                  <div className="space-y-2">
                    {studySessions.map((session) => (
                      <div
                        key={session._id?.toString() || "new"}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          currentSession?._id === session._id
                            ? "bg-blue-50 border-blue-500"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => handleResumeSession(session)}
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {session.topic}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {session.completedCards}/{session.totalCards} completed
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (session._id) {
                              handleDeleteSession(session._id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden w-full">
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
