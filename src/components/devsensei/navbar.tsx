
"use client";

import { Button } from "@/components/ui/button";
import { Github, LogOut, Code2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onGoHome: () => void;
  username?: string;
  avatarUrl?: string;
}

export function Navbar({ isLoggedIn, onLogin, onLogout, onGoHome, username, avatarUrl }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 w-full">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onGoHome}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Code2 className="h-6 w-6" />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-primary">DevSensei</span>
        </div>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <Button 
              variant="default" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg px-6"
              onClick={onLogin}
            >
              <Github className="mr-2 h-4 w-4" />
              Login with GitHub
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                      <AvatarImage src={avatarUrl || `https://picsum.photos/seed/${username || 'user'}/100/100`} alt={username || "User"} />
                      <AvatarFallback>{username ? username.substring(0, 2).toUpperCase() : 'JD'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{username || 'John Developer'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{username ? `${username.toLowerCase()}@github.com` : 'john@example.com'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
