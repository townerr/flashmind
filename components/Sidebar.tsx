"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen } from "lucide-react";
import StudySessionModal from "./StudySessionModal";
import { StudySession } from "@/types/flashcard";

interface SidebarProps {
  studySessions: StudySession[];
  currentSessionId?: string;
  onCreateSession: (topic: string, numCards: number) => Promise<void>;
  onResumeSession: (session: StudySession) => void;
}

export default function Sidebar({ 
  studySessions, 
  currentSessionId, 
  onCreateSession, 
  onResumeSession 
}: SidebarProps) {
  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Flash AI</h1>
      </div>
      
      <Separator className="mb-6" />
      
      {/* Create New Session Modal */}
      <StudySessionModal onCreateSession={onCreateSession} />

      {/* Study Sessions History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Study Sessions
        </h3>
        <div className="space-y-3">
          {studySessions.map((session) => (
            <Card 
              key={session.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                currentSessionId === session.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onResumeSession(session)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {session.topic}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {session.totalCards} cards
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Completed: {session.completedCards}/{session.totalCards}</span>
                  <span>Score: {session.correctAnswers}/{session.completedCards}</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(session.completedCards / session.totalCards) * 100}%` }}
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
