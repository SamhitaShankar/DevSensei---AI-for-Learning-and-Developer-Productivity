
"use client";

import { useState } from "react";
import { Repository } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ChevronRight, Github } from "lucide-react";

interface DashboardProps {
  onSelectRepo: (repo: Repository) => void;
  repos: Repository[];
  userStats?: { id: string | number; name: string };
}

export function Dashboard({ onSelectRepo, repos, userStats }: DashboardProps) {
  const [search, setSearch] = useState("");

  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(search.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold text-primary">My Repositories</h1>
            <div className="px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
              <Github className="h-3 w-3" />
              ID: {userStats?.id}
            </div>
          </div>
          <p className="text-muted-foreground">Hello, {userStats?.name}. Select a repository to explore with Sensei.</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
          <Input 
            className="pl-10 h-11 rounded-xl bg-card border-primary/10 focus-visible:ring-accent"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map((repo) => (
            <Card 
              key={repo.id} 
              className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl mt-2 font-bold tracking-tight text-primary truncate max-w-[80%]">
                    {repo.name}
                  </CardTitle>
                  <span className="text-[10px] font-bold bg-accent/10 text-accent px-1.5 py-0.5 rounded uppercase">
                    {repo.language}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {repo.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <span className="flex items-center gap-1">★ {repo.stars}</span>
                  <span>Updated {repo.updatedAt}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t bg-primary/5 rounded-b-lg mt-4">
                <Button 
                  className="w-full justify-between group-hover:bg-accent group-hover:text-accent-foreground transition-all mt-4 rounded-lg py-6"
                  variant="ghost"
                  onClick={() => onSelectRepo(repo)}
                >
                  Open in DevSensei
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed border-primary/10">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-medium text-primary mb-2">No repositories found</h3>
          <p className="text-muted-foreground">Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  );
}
