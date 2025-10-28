import PublicDeckCard from "./PublicDeckCard";

interface BrowseGridProps {
  sessions: Array<{
    _id: string;
    topic: string;
    totalCards: number;
    creatorName: string;
  }>;
  onCopy: (sessionId: string) => void;
  copyingId: string | null;
}

export default function BrowseGrid({
  sessions,
  onCopy,
  copyingId,
}: BrowseGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sessions.map((session) => (
        <PublicDeckCard
          key={session._id}
          session={session}
          onCopy={onCopy}
          isCopying={copyingId === session._id}
        />
      ))}
    </div>
  );
}
