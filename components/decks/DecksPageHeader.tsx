import StudySessionModal from "@/components/StudySessionModal";
import { useStudyStore } from "@/store/useStudyStore";

interface DecksPageHeaderProps {
  onCreateSession: (topic: string, numCards: number) => Promise<void>;
}

export default function DecksPageHeader({
  onCreateSession,
}: DecksPageHeaderProps) {
  const initComplete = useStudyStore((state) => state.initComplete);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">My Decks</h1>
        <StudySessionModal
          onCreateSession={onCreateSession}
          variant="icon"
          isLoading={!initComplete}
        />
      </div>
      <p className="text-gray-600">
        Manage your study sessions and track your progress
      </p>
    </div>
  );
}
