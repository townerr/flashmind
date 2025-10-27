"use client";

import SignOutButton from "./signout-button";
import Link from "next/link";
import { useConvexAuth } from "convex/react";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";

const Navbar = () => {
  const { isAuthenticated } = useConvexAuth();
  const user = useUserStore((state) => state.user);
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full bg-white dark:bg-gray-900 p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
      {isAuthenticated ? (
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          <Image
            src="/flashmind.svg"
            alt="FlashMind Logo"
            width={45}
            height={45}
          />
          FlashMind
        </Link>
      ) : (
        <span className="text-2xl font-bold">FlashMind</span>
      )}
      <SignOutButton />
    </div>
  );
};

export default Navbar;
