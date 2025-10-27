import DeckCard from "./DeckCard";
import { StudySession } from "@/types/flashcard";
import { Id } from "@/convex/_generated/dataModel";

interface DecksGridProps {
  sessions: StudySession[];
  onStudy: (session: StudySession) => void;
  onDelete: (e: React.MouseEvent, sessionId: Id<"studySessions">) => void;
}

export default function DecksGrid({
  sessions,
  onStudy,
  onDelete,
}: DecksGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sessions.map((session) => (
        <DeckCard
          key={session._id?.toString() || "new"}
          session={session}
          onStudy={onStudy}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
