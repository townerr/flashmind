import { create } from "zustand";
import { StudySession } from "@/types/flashcard";
import { Id } from "@/convex/_generated/dataModel";

interface StudyStore {
  studySessions: StudySession[];
  currentSession: StudySession | null;
  currentCardIndex: number;
  initComplete: boolean;

  // Actions
  setStudySessions: (sessions: StudySession[]) => void;
  setCurrentSession: (session: StudySession | null) => void;
  setCurrentCardIndex: (index: number) => void;
  setInitComplete: (complete: boolean) => void;
  
  // Update specific session in array
  updateSession: (sessionId: Id<"studySessions">, updates: Partial<StudySession>) => void;
  
  // Reset all state
  reset: () => void;
}

const initialState = {
  studySessions: [],
  currentSession: null,
  currentCardIndex: 0,
  initComplete: false,
};

export const useStudyStore = create<StudyStore>((set) => ({
  ...initialState,

  setStudySessions: (sessions) => set({ studySessions: sessions }),

  setCurrentSession: (session) => 
    set({ 
      currentSession: session,
      currentCardIndex: 0, // Reset card index when changing session
    }),

  setCurrentCardIndex: (index) => set({ currentCardIndex: index }),

  setInitComplete: (complete) => set({ initComplete: complete }),

  updateSession: (sessionId, updates) =>
    set((state) => ({
      studySessions: state.studySessions.map((session) =>
        session._id?.toString() === sessionId.toString()
          ? { ...session, ...updates }
          : session
      ),
      // Also update current session if it's the one being updated
      currentSession: state.currentSession?._id?.toString() === sessionId.toString()
        ? { ...state.currentSession, ...updates }
        : state.currentSession,
    })),

  reset: () => set(initialState),
}));
