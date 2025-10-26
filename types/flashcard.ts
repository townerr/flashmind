export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  isCorrect?: boolean;
}

export interface StudySession {
  id: string;
  topic: string;
  totalCards: number;
  cards: Flashcard[];
  completedCards: number;
  correctAnswers: number;
  createdAt: Date;
}
