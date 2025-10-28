"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStudyStore } from "@/store/useStudyStore";
import { useUserStore } from "@/store/useUserStore";
import { useStudySession } from "@/hooks/useStudySession";
import DecksPageHeader from "@/components/decks/DecksPageHeader";
import DecksGrid from "@/components/decks/DecksGrid";
import DecksGridSkeleton from "@/components/decks/DecksGridSkeleton";
import EmptyDecksState from "@/components/decks/EmptyDecksState";
import EditDeckModal from "@/components/decks/EditDeckModal";
import { StudySession } from "@/types/flashcard";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

export default function DecksPage() {
  const router = useRouter();
  const { studySessions, createStudySession, deleteSession, resumeSession } =
    useStudySession();
  const togglePublicMutation = useMutation(api.userApi.toggleSessionPublic);
  const [editingSession, setEditingSession] = useState<StudySession | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        isPublic: session.isPublic,
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

  const handleTogglePublic = async (
    sessionId: Id<"studySessions">,
    isPublic: boolean,
  ) => {
    await togglePublicMutation({ sessionId, isPublic });
    // Optimistically update the local state
    const updatedSession = studySessions.find(
      (s) => s._id?.toString() === sessionId.toString(),
    );
    if (updatedSession) {
      updatedSession.isPublic = isPublic;
    }
  };

  const handleEditDeck = (session: StudySession) => {
    setEditingSession(session);
    setIsEditModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setIsEditModalOpen(open);
    if (!open) {
      setEditingSession(null);
    }
  };

  const handleUpdate = () => {
    // Trigger a re-fetch or refresh of the sessions
    // The query will automatically update when the mutation completes
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
              onEdit={handleEditDeck}
              onTogglePublic={handleTogglePublic}
            />
          )}
        </Suspense>
      </div>

      {/* Edit Deck Modal */}
      <EditDeckModal
        session={editingSession}
        open={isEditModalOpen}
        onOpenChange={handleModalClose}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
