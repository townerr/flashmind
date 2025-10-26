import { Id } from "@/convex/_generated/dataModel";

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  answeredCorrect?: boolean;
}

export interface StudySession {
  _id?: Id<"studySessions">;
  topic: string;
  totalCards: number;
  cards: Flashcard[];
  completedCards: number;
  correctAnswers: number;
}
