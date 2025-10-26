"use client";

import { useAuthActions } from '@convex-dev/auth/react';
import { useRouter } from 'next/navigation';
import { useConvexAuth } from 'convex/react';

const SignOutButton = () => {
    const { isAuthenticated } = useConvexAuth();
    const { signOut } = useAuthActions();
    const router = useRouter();
    return (
      <>
        {isAuthenticated && (
          <button
            className="bg-slate-200 dark:bg-slate-800 text-foreground rounded-md px-2 py-1"
            onClick={() =>
              void signOut().then(() => {
                router.push("/signin");
              })
            }
          >
            Sign out
          </button>
        )}
      </>
    );
}

export default SignOutButton