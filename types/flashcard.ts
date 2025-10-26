export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  answeredCorrect?: boolean;
}

export interface StudySession {
  id: string;
  topic: string;
  totalCards: number;
  cards: Flashcard[];
  completedCards: number;
  correctAnswers: number;
}
