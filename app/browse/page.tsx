"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import BrowsePageHeader from "@/components/browse/BrowsePageHeader";
import BrowseGrid from "@/components/browse/BrowseGrid";
import DecksGridSkeleton from "@/components/decks/DecksGridSkeleton";
import EmptyBrowseState from "@/components/browse/EmptyBrowseState";
import { toast } from "sonner";

function BrowseContent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [copyingId, setCopyingId] = useState<string | null>(null);

  const publicSessions = useQuery(api.userApi.getPublicStudySessions);
  const copyDeckMutation = useMutation(api.userApi.copyPublicDeck);

  // Client-side filtering by topic
  const filteredSessions = useMemo(() => {
    if (!publicSessions) return [];

    if (!searchTerm.trim()) return publicSessions;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return publicSessions.filter((session) =>
      session.topic.toLowerCase().includes(lowerSearchTerm),
    );
  }, [publicSessions, searchTerm]);

  const handleCopyDeck = async (sessionId: string) => {
    setCopyingId(sessionId);
    try {
      await copyDeckMutation({ sessionId: sessionId as Id<"studySessions"> });
      toast.success("Deck copied to your collection!");
      router.push("/decks");
    } catch (error) {
      console.error("Failed to copy deck:", error);
      toast.error("Failed to copy deck. Please try again.");
    } finally {
      setCopyingId(null);
    }
  };

  if (!publicSessions) {
    return <DecksGridSkeleton />;
  }

  return (
    <>
      <BrowsePageHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {filteredSessions.length === 0 ? (
        <EmptyBrowseState hasSearchTerm={searchTerm.trim() !== ""} />
      ) : (
        <BrowseGrid
          sessions={filteredSessions}
          onCopy={handleCopyDeck}
          copyingId={copyingId}
        />
      )}
    </>
  );
}

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<DecksGridSkeleton />}>
          <BrowseContent />
        </Suspense>
      </div>
    </div>
  );
}
