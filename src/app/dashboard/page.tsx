
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/devsensei/navbar";
import { Dashboard } from "@/components/devsensei/dashboard";
import { RepoView } from "@/components/devsensei/repo-view";
import { Repository } from "@/lib/mock-data";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

function DashboardContent() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'repo-view'>('dashboard');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  useEffect(() => {
    // Check for errors passed from the server in the URL
    const error = searchParams.get('error');
    if (error) {
      toast({
        title: "Error",
        description: error.replace(/_/g, ' '),
        variant: "destructive",
      });
      // Redirect to home to clear the URL
      router.replace('/');
      return;
    }

    async function init() {
      setLoading(true);
      try {
        // Use relative paths for API calls
        const meRes = await fetch(`/api/me`);
        if (!meRes.ok) {
          // If unauthorized, redirect to login
          if (meRes.status === 401) {
            router.push('/');
          }
          return;
        }
        const userData = await meRes.json();
        setUser(userData);

        const reposRes = await fetch(`/api/repos`);
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          setRepos(reposData);
        } else {
           toast({
            title: "Could not fetch repos",
            description: "There was an issue fetching your repositories from GitHub.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Initialization error:", error);
        toast({
          title: "Connection Error",
          description: "Could not connect to the server.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [router, toast, searchParams]);

  const handleLogout = async () => {
    try {
      await fetch(`/api/logout`, { method: 'POST' });
      router.push('/');
    } catch (e) {
      console.error("Logout failed", e);
      router.push('/');
    }
  };

  const handleSelectRepo = (repo: Repository) => {
    setSelectedRepo(repo);
    setView('repo-view');
  };

  const handleGoHome = () => {
    setView('dashboard');
    setSelectedRepo(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-medium">Synchronizing with GitHub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent/30">
      <Navbar 
        isLoggedIn={true} 
        onLogin={() => {}} 
        onLogout={handleLogout}
        onGoHome={handleGoHome}
        username={user?.username || 'Developer'}
        avatarUrl={user?.avatar}
      />
      
      <main className="flex-1 flex flex-col">
        {view === 'dashboard' ? (
          <Dashboard 
            onSelectRepo={handleSelectRepo} 
            repos={repos} 
            userStats={{ id: user?.id, name: user?.name }} 
          />
        ) : (
          selectedRepo && (
            <RepoView repo={selectedRepo} onBack={() => setView('dashboard')} />
          )
        )}
      </main>

      <Toaster />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
