"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles, ShieldCheck, Terminal, Cpu } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-sm mb-8">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Mentorship for Modern Teams</span>
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-primary mb-6 leading-tight">
            Write code with a <span className="text-accent">Senior Mentor</span> by your side.
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Understand complex logic, debug instantly, and improve code quality with DevSensei's intelligent context-aware assistant.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-xl px-8 py-6 text-lg bg-primary hover:bg-primary/90" onClick={onStart}>
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl px-8 py-6 text-lg border-primary/20 hover:bg-primary/5">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <Cpu className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold">Deep Code Context</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">DevSensei understands your entire repository structure, providing suggestions that actually make sense in your environment.</p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Terminal className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold">Interactive Explanations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Stop guessing what the code does. DevSensei breaks down complex functions into simple, logical steps for easier learning.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold">Quality First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Automated improvement suggestions focused on readability, performance, and best practices used by world-class engineers.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            <span className="font-bold text-primary">DevSensei</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 DevSensei. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}