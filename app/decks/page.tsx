"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStudyStore } from "@/store/useStudyStore";
import { useUserStore } from "@/store/useUserStore";
import { useStudySession } from "@/hooks/useStudySession";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Trash2, MoreVertical } from "lucide-react";
import StudySessionModal from "@/components/StudySessionModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    sessionId: Id<"studySessions">
  ) => {
    e.stopPropagation();
    await deleteSession(sessionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">My Decks</h1>
            <StudySessionModal
              onCreateSession={createStudySession}
              variant="icon"
            />
          </div>
          <p className="text-gray-600">
            Manage your study sessions and track your progress
          </p>
        </div>

        {/* Decks Grid */}
        {studySessions.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No decks yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first study deck to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {studySessions.map((session) => (
              <Card
                key={session._id?.toString() || "new"}
                className="hover:shadow-lg transition-shadow duration-200 bg-white"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                        {session.topic}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {session.totalCards} cards
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white active:bg-red-100">
                        <DropdownMenuItem
                          className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700"
                          onClick={(e) => {
                            if (session._id) {
                              handleDeleteDeck(e, session._id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Deck
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">
                        {session.completedCards}/{session.totalCards}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(session.completedCards / session.totalCards) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Score</span>
                      <span className="font-medium text-green-600">
                        {session.completedCards > 0
                          ? `${Math.round((session.correctAnswers / session.completedCards) * 100)}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleStudyDeck(session)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Study
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
