"use client"

import SignOutButton from "./signout-button"
import Link from "next/link"
import { useConvexAuth } from "convex/react"

const Navbar = () => {
  const { isAuthenticated } = useConvexAuth();

  return (
    <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        {isAuthenticated ? <Link href="/" className="text-2xl font-bold">FlashMind</Link> : <span className="text-2xl font-bold">FlashMind</span> }
        <SignOutButton />
      </header>
  )
}

export default Navbar