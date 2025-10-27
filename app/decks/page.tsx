"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStudyStore } from "@/store/useStudyStore";
import { useUserStore } from "@/store/useUserStore";
import { useStudySession } from "@/hooks/useStudySession";
import DecksPageHeader from "@/components/decks/DecksPageHeader";
import DecksGrid from "@/components/decks/DecksGrid";
import DecksGridSkeleton from "@/components/decks/DecksGridSkeleton";
import EmptyDecksState from "@/components/decks/EmptyDecksState";
import { StudySession } from "@/types/flashcard";
import { Id } from "@/convex/_generated/dataModel";

export default function DecksPage() {
  const router = useRouter();
  const { studySessions, createStudySession, deleteSession, resumeSession } =
    useStudySession();

  // Query and sync data
  const sessions = useQuery(api.userApi.getUserStudySessions);
  const user = useQuery(api.userApi.getCurrentUser);
  const setStudySessions = useStudyStore((state) => state.setStudySessions);
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

  // Sync user data
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  const handleStudyDeck = (session: StudySession) => {
    resumeSession(session);
    router.push("/");
  };

  const handleDeleteDeck = async (
    e: React.MouseEvent,
    sessionId: Id<"studySessions">,
  ) => {
    e.stopPropagation();
    await deleteSession(sessionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <DecksPageHeader onCreateSession={createStudySession} />

        <Suspense fallback={<DecksGridSkeleton />}>
          {studySessions.length === 0 ? (
            <EmptyDecksState />
          ) : (
            <DecksGrid
              sessions={studySessions}
              onStudy={handleStudyDeck}
              onDelete={handleDeleteDeck}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}
