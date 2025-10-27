import { BookOpen } from "lucide-react";

export default function EmptyDecksState() {
  return (
    <div className="text-center py-12">
      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">No decks yet</h2>
      <p className="text-gray-600 mb-6">
        Create your first study deck to get started
      </p>
    </div>
  );
}
