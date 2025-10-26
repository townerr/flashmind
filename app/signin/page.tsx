"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthActions } from "@convex-dev/auth/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { toast, Toaster } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [step, setStep] = useState<"signIn" | "linkSent">("signIn");

  return (
    <div className="flex min-h-screen w-full container my-auto mx-auto">
      <div className="max-w-[384px] mx-auto flex flex-col my-auto gap-4 pb-8">
        {step === "signIn" ? (
          <>
            <h2 className="font-semibold text-2xl tracking-tight">
              Sign in to start studying!
            </h2>
            <SignInAsGuest />
            <SignInWithGitHub />
            <div className="flex items-center">
              <div className="flex-grow border-t border-neutral-300"></div>
              <span className="px-3 text-neutral-500 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-neutral-300"></div>
            </div>
            <SignInWithMagicLink handleLinkSent={() => setStep("linkSent")} />
          </>
        ) : (
          <>
            <h2 className="font-semibold text-2xl tracking-tight">
              Check your email
            </h2>
            <p>A sign-in link has been sent to your email address.</p>
            <Button
              className="p-0 self-start"
              variant="link"
              onClick={() => setStep("signIn")}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function SignInWithGitHub() {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="flex-1 hover:bg-neutral-100 active:bg-neutral-200 hover:text-black"
      variant="outline"
      type="button"
      onClick={() => void signIn("github", { redirectTo: "/" })}
    >
      <GitHubLogoIcon className="mr-2 h-4 w-4" /> Sign in with GitHub
    </Button>
  );
}

function SignInAsGuest() {
  const { signIn } = useAuthActions();
  const router = useRouter();

  const handleSignIn = () => {
    void signIn("anonymous", { redirectTo: "/" }).then(() => {
      router.push("/");
    });
  };

  return (
    <Button
      className="flex-1 hover:bg-neutral-100 active:bg-neutral-200 hover:text-black"
      variant="outline"
      type="button"
      onClick={handleSignIn}
    >
      Continue as Guest
    </Button>
  );
}

function SignInWithMagicLink({
  handleLinkSent,
}: {
  handleLinkSent: () => void;
}) {
  const { signIn } = useAuthActions();
  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set("redirectTo", "/");
        signIn("resend", formData)
          .then(handleLinkSent)
          .catch((error) => {
            console.error(error);
            toast.error("Could not send sign-in link");
          });
      }}
    >
      <label htmlFor="email">Email</label>
      <Input name="email" id="email" className="mb-4" autoComplete="email" />
      <Button className="bg-black text-white active:bg-black/80 hover:bg-black/90" type="submit">Send sign-in link to email</Button>
      <Toaster />
    </form>
  );
}