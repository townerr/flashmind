"use client";

import SignOutButton from "./signout-button";
import Link from "next/link";
import { useConvexAuth } from "convex/react";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, BookOpen, Globe } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const Navbar = () => {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const getInitials = (username?: string) => {
    if (!username) return "GU";
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full bg-white dark:bg-gray-900 p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
      <Link
        href="/"
        className="text-2xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <Image
          src="/flashmind.svg"
          alt="FlashMind Logo"
          width={45}
          height={45}
        />
        FlashMind
      </Link>

      <div className="flex items-center gap-4">
        {/* Navigation Links */}
        <Link
          href="/"
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-200 rounded-full p-2 transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          Study
        </Link>
        <Link
          href="/decks"
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-200 rounded-full p-2 transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          My Decks
        </Link>
        <Link
          href="/browse"
          className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-200 rounded-full p-2 transition-colors"
        >
          <Globe className="h-4 w-4" />
          Browse Decks
        </Link>

        {/* User Dropdown */}
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 hover:bg-gray-200 rounded-full"
              >
                <Avatar>
                  <AvatarImage src={user.image} alt={user.username} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {getInitials(user.username)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium">
                  {user.username ?? "Guest"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.username ?? "Guest"}
                  </p>
                  {user.email && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="focus:bg-neutral-200 focus:outline-none active:bg-neutral-300">
                <Link
                  href="/settings"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer focus:bg-red-100 focus:outline-none active:bg-red-200"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SignOutButton />
        )}
      </div>
    </div>
  );
};

export default Navbar;