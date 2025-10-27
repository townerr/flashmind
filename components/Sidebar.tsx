"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BookOpen, Trash2 } from "lucide-react";
import StudySessionModal from "./StudySessionModal";
import { StudySession } from "@/types/flashcard";
import { Id } from "@/convex/_generated/dataModel";
import { useUserStore } from "@/store/useUserStore";

interface SidebarProps {
  studySessions: StudySession[];
  currentSessionId?: string;
  onCreateSession: (topic: string, numCards: number) => Promise<void>;
  onResumeSession: (session: StudySession) => void;
  onDeleteSession: (sessionId: Id<"studySessions">) => void;
  initComplete: boolean;
}

export default function Sidebar({
  studySessions,
  currentSessionId,
  onCreateSession,
  onResumeSession,
  onDeleteSession,
  initComplete,
}: SidebarProps) {
  // Get user data from store
  const userName = useUserStore((state) => state.user?.username ?? "Guest");

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation(); // Prevent triggering the card click
    onDeleteSession(sessionId as Id<"studySessions">);
  };

  return (
    <div className="z-10 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto h-full">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {userName}&apos;s Study Deck
        </h1>
      </div>

      <Separator className="mb-6" />

      {/* Create New Session Modal */}
      <StudySessionModal
        onCreateSession={onCreateSession}
        isLoading={!initComplete}
      />

      {/* Study Sessions History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Study Sessions
        </h3>
        <div className="space-y-3">
          {studySessions.map((session) => (
            <Card
              key={session._id?.toString() || "new"}
              className={`cursor-pointer transition-all hover:shadow-md ${
                currentSessionId === session._id?.toString() || ""
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
              onClick={() => onResumeSession(session)}
            >
              <CardContent className="p-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    if (session._id) {
                      handleDeleteSession(e, session._id);
                      e.stopPropagation();
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="flex justify-between items-start mb-2 pr-10">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {session.topic}
                  </h4>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>{session.totalCards} cards</span>
                  <span>
                    Completed: {session.completedCards}/{session.totalCards}
                  </span>
                  <span>
                    Score: {session.correctAnswers}/{session.completedCards}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(session.completedCards / session.totalCards) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
