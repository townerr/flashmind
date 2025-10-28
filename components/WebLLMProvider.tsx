"use client";

import { useEffect } from "react";
import { initializeEngine, isEngineInitialized } from "@/lib/webllm";
import { useStudyStore } from "@/store/useStudyStore";
import { useConvexAuth } from "convex/react";

interface WebLLMProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that initializes the WebLLM engine once when the user is authenticated
 * and maintains it across all pages and navigation.
 */
export default function WebLLMProvider({ children }: WebLLMProviderProps) {
  const setInitComplete = useStudyStore((state) => state.setInitComplete);
  const { isAuthenticated } = useConvexAuth();

  useEffect(() => {
    // Only initialize if user is authenticated and engine hasn't been initialized yet
    if (!isAuthenticated || isEngineInitialized()) {
      if (!isAuthenticated) {
        console.log("Waiting for user authentication before initializing WebLLM...");
      }
      return;
    }

    async function handleInitialize() {
      try {
        console.log("Starting WebLLM engine initialization...");

        await initializeEngine((progress) => {
          // Optional: You can update store with progress percentage/message here
          console.log("Init progress:", progress.progress);
        });

        console.log("WebLLM engine ready!");
        setInitComplete(true);
      } catch (error) {
        console.error("Failed to initialize WebLLM engine:", error);
        // Engine failed to initialize, but app should still work
        // (just can't create new flashcards)
      }
    }

    handleInitialize();
  }, [isAuthenticated, setInitComplete]);

  return <>{children}</>;
}
