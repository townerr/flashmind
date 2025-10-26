"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { StudySession } from "@/types/flashcard";

interface FlashcardStudyProps {
  session: StudySession;
  onMarkCard: (isCorrect: boolean) => void;
  onNavigateCard: (direction: 'prev' | 'next') => void;
  onCompleteSession: () => void;
  currentCardIndex: number;
}

export default function FlashcardStudy({ 
  session, 
  onMarkCard, 
  onNavigateCard, 
  onCompleteSession, 
  currentCardIndex 
}: FlashcardStudyProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const currentCard = session.cards[currentCardIndex];

  const handleNavigateCard = (direction: 'prev' | 'next') => {
    setIsFlipped(false);
    onNavigateCard(direction);
  };

  const handleMarkCard = (isCorrect: boolean) => {
    setIsFlipped(false);
    onMarkCard(isCorrect);
  };

  return (
    <div className="w-full max-w-4xl max-h-full overflow-y-auto">
      {/* Progress Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {session.topic}
        </h2>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Card {currentCardIndex + 1} of {session.totalCards}</span>
          <span>•</span>
          <span>Correct: {session.correctAnswers}</span>
          <span>•</span>
          <span>Completed: {session.completedCards}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentCardIndex + 1) / session.totalCards) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative mb-8 perspective-1000">
        <div 
          className={`w-full max-w-2xl mx-auto cursor-pointer transition-transform duration-700 preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <Card className="bg-white w-full hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-12 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <RotateCcw className="h-8 w-8 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {isFlipped ? 'Answer' : 'Question'}
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {isFlipped ? currentCard?.answer : currentCard?.question}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Click to {isFlipped ? 'see question' : 'see answer'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation and Actions */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => handleNavigateCard('prev')}
          disabled={currentCardIndex === 0}
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-600/90 active:bg-blue-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-4">
          {isFlipped && (
            <>
              <Button
                variant="outline"
                onClick={() => handleMarkCard(false)}
                className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-600/90 active:bg-red-700"
              >
                <XCircle className="h-4 w-4" />
                Incorrect
              </Button>
              <Button
                onClick={() => handleMarkCard(true)}
                className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-600/90 active:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                Correct
              </Button>
            </>
          )}
        </div>

        <Button
          onClick={() => handleNavigateCard('next')}
          disabled={currentCardIndex === session.cards.length - 1}
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-600/90 active:bg-blue-700"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Complete Session Button */}
      <div className="text-center mt-8">
        <Button
          onClick={onCompleteSession}
          className="px-8 text-white bg-black hover:bg-black/90 active:bg-black/70"
        >
          Complete Study Session
        </Button>
      </div>
    </div>
  );
}
