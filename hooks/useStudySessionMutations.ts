import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCallback, useEffect, useRef } from "react";
import { debounce } from "lodash";
import { useStudyStore } from "@/store/useStudyStore";
import { StudySession } from "@/types/flashcard";

/**
 * Custom hook for managing study session mutations with optimistic updates
 */
export function useStudySessionMutations() {
  const updateSessionMutation = useMutation(api.userApi.updateUserStudySession);
  const createMutation = useMutation(api.userApi.createUserStudySession);
  const deleteMutation = useMutation(api.userApi.deleteUserStudySession);
  const updateSessionInStore = useStudyStore((state) => state.updateSession);

  // Debounced update function for auto-saving card progress
  const debouncedUpdate = useRef(
    debounce(async (sessionId: Id<"studySessions">, updates: Partial<StudySession>) => {
      try {
        await updateSessionMutation({ sessionId, updates });
      } catch (error) {
        console.error("Failed to auto-save session:", error);
        // On error, could show a toast notification here
      }
    }, 500)
  ).current;

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  /**
   * Create a new study session with optimistic update
   */
  const createSession = useCallback(
    async (studySession: Omit<StudySession, "_id" | "createdAt">) => {
      try {
        const sessionId = await createMutation({ studySession });
        
        // Optimistically add to store with the sessionId
        const newSession: StudySession = {
          ...studySession,
          _id: sessionId as Id<"studySessions">,
          createdAt: new Date(),
        };

        const sessions = useStudyStore.getState().studySessions;
        useStudyStore.setState({
          studySessions: [newSession, ...sessions],
        });

        return newSession;
      } catch (error) {
        console.error("Failed to create session:", error);
        throw error;
      }
    },
    [createMutation]
  );

  /**
   * Update study session with optimistic update and debounced save
   */
  const updateSession = useCallback(
    (sessionId: Id<"studySessions">, updates: Partial<StudySession>) => {
      // Optimistically update the store immediately using the store's updateSession action
      updateSessionInStore(sessionId, updates);
      
      // Trigger debounced save to database
      debouncedUpdate(sessionId, updates);
    },
    [debouncedUpdate, updateSessionInStore]
  );

  /**
   * Delete study session with optimistic update
   */
  const deleteSession = useCallback(
    async (sessionId: Id<"studySessions">) => {
      const currentState = useStudyStore.getState();

      // Optimistically remove from store
      const newSessions = currentState.studySessions.filter(
        (s) => s._id?.toString() !== sessionId.toString()
      );

      // If deleting current session, clear it
      const shouldClearCurrent =
        currentState.currentSession?._id?.toString() === sessionId.toString();

      useStudyStore.setState({
        studySessions: newSessions,
        currentSession: shouldClearCurrent ? null : currentState.currentSession,
        currentCardIndex: shouldClearCurrent ? 0 : currentState.currentCardIndex,
      });

      try {
        await deleteMutation({ studySessionId: sessionId });
      } catch (error) {
        console.error("Failed to delete session:", error);
        // Rollback on error
        useStudyStore.setState({
          studySessions: currentState.studySessions,
          currentSession: currentState.currentSession,
          currentCardIndex: currentState.currentCardIndex,
        });
        throw error;
      }
    },
    [deleteMutation]
  );

  return {
    createSession,
    updateSession,
    deleteSession,
  };
}
