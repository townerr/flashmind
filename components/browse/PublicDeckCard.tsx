import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Globe, User, Loader2 } from "lucide-react";

interface PublicDeckCardProps {
  session: {
    _id: string;
    topic: string;
    totalCards: number;
    creatorName: string;
  };
  onCopy: (sessionId: string) => void;
  isCopying: boolean;
}

export default function PublicDeckCard({
  session,
  onCopy,
  isCopying,
}: PublicDeckCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="text-lg font-semibold text-gray-900 truncate"
                title={session.topic}
              >
                {session.topic}
              </h3>
              <Globe className="h-4 w-4 text-blue-600 flex-shrink-0" />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {session.totalCards} cards
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>by {session.creatorName}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => onCopy(session._id)}
          disabled={isCopying}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isCopying ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Copying...
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy to My Decks
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
