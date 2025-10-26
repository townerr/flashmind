"use client";

import { BookOpen } from "lucide-react";
import Image from "next/image";

export default function WelcomeScreen() {
  return (
    <div className="text-center">
      <Image
        src="/flashmind.svg"
        alt="FlashMind Logo"
        width={150}
        height={150}
        className="mx-auto mb-6 fill-blue-600 hover:animate-spin-slow"
      />
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome to FlashMind
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Create a new study session by entering a topic and number of flashcards
        you&apos;d like to generate.
      </p>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Use the sidebar to get started or resume a previous session.
      </div>
    </div>
  );
}
