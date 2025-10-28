import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Trash2,
  MoreVertical,
  Globe,
  Lock,
  Edit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { StudySession } from "@/types/flashcard";
import { Id } from "@/convex/_generated/dataModel";

interface DeckCardProps {
  session: StudySession;
  onStudy: (session: StudySession) => void;
  onDelete: (e: React.MouseEvent, sessionId: Id<"studySessions">) => void;
  onEdit: (session: StudySession) => void;
  onTogglePublic: (sessionId: Id<"studySessions">, isPublic: boolean) => void;
}

export default function DeckCard({
  session,
  onStudy,
  onDelete,
  onEdit,
  onTogglePublic,
}: DeckCardProps) {
  const calculateScorePercentage = () => {
    if (session.completedCards === 0) return "0%";
    return `${Math.round((session.correctAnswers / session.completedCards) * 100)}%`;
  };

  const calculateProgressWidth = () => {
    return `${(session.completedCards / session.totalCards) * 100}%`;
  };

  const handleTogglePublic = () => {
    if (session._id) {
      onTogglePublic(session._id, !session.isPublic);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 bg-white">
      <CardContent className="p-6">
        {/* Header with title and menu */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="text-lg font-semibold text-gray-900 truncate"
                title={session.topic}
              >
                {session.topic}
              </h3>
              {session.isPublic ? (
                <Globe className="h-4 w-4 text-blue-600 flex-shrink-0" />
              ) : (
                <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
              )}
            </div>
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
                className="cursor-pointer focus:bg-neutral-100 active:bg-neutral-200"
                onClick={() => onEdit(session)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Deck
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer focus:bg-neutral-100 active:bg-neutral-200"
                onClick={handleTogglePublic}
              >
                {session.isPublic ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Make Private
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Make Public
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
