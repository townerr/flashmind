export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  answeredCorrect?: boolean;
}

export interface StudySession {
  id?: string | null;
  topic: string;
  totalCards: number;
  cards: Flashcard[];
  completedCards: number;
  correctAnswers: number;
}
