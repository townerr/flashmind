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
            className="bg-blue-600 text-white active:bg-blue-700 hover:bg-blue-600/90 rounded-md px-2 py-1"
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