import { Globe } from "lucide-react";

interface EmptyBrowseStateProps {
  hasSearchTerm: boolean;
}

export default function EmptyBrowseState({
  hasSearchTerm,
}: EmptyBrowseStateProps) {
  return (
    <div className="text-center py-12">
      <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {hasSearchTerm ? "No decks found" : "No public decks yet"}
      </h2>
      <p className="text-gray-600">
        {hasSearchTerm
          ? "Try a different search term"
          : "Be the first to share a deck with the community"}
      </p>
    </div>
  );
}
