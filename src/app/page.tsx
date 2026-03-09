"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/devsensei/navbar";
import { LandingPage } from "@/components/devsensei/landing-page";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

function HomeComponent() {
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsMounted(true);
    const error = searchParams.get("error");
    if (error) {
      toast({
        title: "Authentication Error",
        description: error.split("_").join(" "),
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  if (!isMounted) return null;

  function loginWithGithub() {
    const GITHUB_CLIENT_ID =
      process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "Ov23liZpEdu0eKMEAnHR";

    // Dynamically detect current domain (works for localhost + production)
    const callbackUrl = `${window.location.origin}/api/github/callback`;

    const redirect =
      "https://github.com/login/oauth/authorize" +
      `?client_id=${GITHUB_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(callbackUrl)}` +
      "&scope=read:user,user:email,repo";

    window.location.href = redirect;
  }

  const handleGoHome = () => {
    // Already on landing page
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent/30">
      <Navbar
        isLoggedIn={false}
        onLogin={loginWithGithub}
        onLogout={() => {}}
        onGoHome={handleGoHome}
      />

      <main className="flex-1 flex flex-col">
        <LandingPage onStart={loginWithGithub} />
      </main>

      <Toaster />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeComponent />
    </Suspense>
  );
}