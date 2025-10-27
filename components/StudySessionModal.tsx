"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";

interface StudySessionModalProps {
  onCreateSession: (topic: string, numCards: number) => Promise<void>;
  variant?: "default" | "icon";
  isLoading?: boolean;
}

export default function StudySessionModal({
  onCreateSession,
  variant = "default",
  isLoading = false,
}: StudySessionModalProps) {
  const [topic, setTopic] = useState("");
  const [numCards, setNumCards] = useState(5);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      // Reset form when modal is closed without creating
      setTopic("");
      setNumCards(5);
    }
  };

  const handleCreateSession = async () => {
    if (!topic.trim()) return;

    setIsCreating(true);
    try {
      await onCreateSession(topic, numCards);
      setIsModalOpen(false);
      setTopic("");
      setNumCards(5);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="ghost"
            size="icon"
            className="w-auto mt-1 px-2 text-white hover:text-white bg-blue-600 hover:bg-blue-600/90 active:bg-blue-600/80 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Loading AI
                Engine...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" /> Create Deck
              </>
            )}
          </Button>
        ) : (
          <Button
            className="w-full mb-6 text-white bg-blue-600 hover:bg-blue-600/90 active:bg-blue-700"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Loading AI Engine...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Create New Study Session
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Study Session
          </DialogTitle>
          <DialogDescription>
            Enter the topic you want to study and the number of flashcards to
            generate.
          </DialogDescription>
        </DialogHeader>

        {isCreating ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Generating Flashcards
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              AI is creating your study materials...
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Topic
              </label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter study topic..."
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Number of Cards
              </label>
              <Input
                type="number"
                value={numCards}
                onChange={(e) => setNumCards(parseInt(e.target.value) || 5)}
                min="1"
                max="50"
                className="w-full"
              />
            </div>
          </div>
        )}
        {!isCreating && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleModalClose(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSession}
              disabled={!topic.trim() || isCreating}
            >
              Generate Flashcards
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
