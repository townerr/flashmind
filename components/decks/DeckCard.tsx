import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StudySession } from "@/types/flashcard";
import { Id } from "@/convex/_generated/dataModel";

interface DeckCardProps {
  session: StudySession;
  onStudy: (session: StudySession) => void;
  onDelete: (e: React.MouseEvent, sessionId: Id<"studySessions">) => void;
}

export default function DeckCard({ session, onStudy, onDelete }: DeckCardProps) {
  const calculateScorePercentage = () => {
    if (session.completedCards === 0) return "0%";
    return `${Math.round((session.correctAnswers / session.completedCards) * 100)}%`;
  };

  const calculateProgressWidth = () => {
    return `${(session.completedCards / session.totalCards) * 100}%`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 bg-white">
      <CardContent className="p-6">
        {/* Header with title and menu */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-semibold text-gray-900 truncate mb-1"
              title={session.topic}
            >
              {session.topic}
            </h3>
            <p className="text-sm text-gray-600">{session.totalCards} cards</p>
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
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem
                className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700"
                onClick={(e) => {
                  if (session._id) {
                    onDelete(e, session._id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Deck
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Progress stats */}
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
              style={{ width: calculateProgressWidth() }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Score</span>
            <span className="font-medium text-green-600">
              {calculateScorePercentage()}
            </span>
          </div>
        </div>

        {/* Study button */}
        <Button
          onClick={() => onStudy(session)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Study
        </Button>
      </CardContent>
    </Card>
  );
}

