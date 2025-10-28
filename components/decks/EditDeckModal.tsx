"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Plus, Trash2 } from "lucide-react";
import { StudySession } from "@/types/flashcard";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface EditDeckModalProps {
  session: StudySession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export default function EditDeckModal({
  session,
  open,
  onOpenChange,
  onUpdate,
}: EditDeckModalProps) {
  const [topic, setTopic] = useState("");
  const [cards, setCards] = useState<
    Array<{ id: string; question: string; answer: string }>
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const updateSessionMutation = useMutation(api.userApi.updateUserStudySession);

  useEffect(() => {
    if (session) {
      setTopic(session.topic);
      setCards(
        session.cards.map((card) => ({
          id: card.id || Math.random().toString(),
          question: card.question,
          answer: card.answer,
        })),
      );
    }
  }, [session]);

  const handleSave = async () => {
    if (!session?._id || !topic.trim() || cards.length === 0) return;

    setIsSaving(true);
    try {
      await updateSessionMutation({
        sessionId: session._id,
        updates: {
          topic,
          cards: cards.map((card) => ({
            id: card.id,
            question: card.question,
            answer: card.answer,
          })),
        },
      });
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update deck:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCard = () => {
    setCards([
      ...cards,
      { id: Math.random().toString(), question: "", answer: "" },
    ]);
  };

  const handleRemoveCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleCardChange = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setCards(newCards);
  };

  const hasChanges = () => {
    if (!session) return false;
    if (topic !== session.topic) return true;
    if (cards.length !== session.cards.length) return true;
    return cards.some(
      (card, idx) =>
        card.question !== session.cards[idx]?.question ||
        card.answer !== session.cards[idx]?.answer,
    );
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Deck
          </DialogTitle>
          <DialogDescription>
            Update your deck topic, questions, and answers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Topic Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Deck Topic
            </label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter study topic..."
              className="w-full"
            />
          </div>

          {/* Cards */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-gray-700">
                Flashcards ({cards.length})
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCard}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-600">
                      Card {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCard(index)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div> 
                      <label className="text-xs text-gray-600 mb-1 block">
                        Question
                      </label>
                      <Input
                        value={card.question}
                        onChange={(e) =>
                          handleCardChange(index, "question", e.target.value)
                        }
                        placeholder="Enter question..."
                        className="w-full bg-white text-black"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        Answer
                      </label>
                      <Input
                        value={card.answer}
                        onChange={(e) =>
                          handleCardChange(index, "answer", e.target.value)
                        }
                        placeholder="Enter answer..."
                        className="w-full bg-white text-black"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !topic.trim() || cards.length === 0 || isSaving || !hasChanges()
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
