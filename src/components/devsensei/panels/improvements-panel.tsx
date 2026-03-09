"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, Code2, Rocket } from "lucide-react";
import { SectionTitle, CodeBlock } from "./shared";
import { Badge } from "@/components/ui/badge";

interface Improvement {
  suggestion: string;
  reason: string;
  impact: string;
}

interface ImprovementsData {
  improvements: Improvement[];
  refactoredSnippet: string;
}

export function ImprovementsPanel({ data }: { data: ImprovementsData }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <section>
        <SectionTitle icon={Rocket}>Suggested Improvements</SectionTitle>
        <div className="space-y-4">
          {data.improvements?.map((imp, idx) => (
            <Card key={idx} className="border-primary/5 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-primary flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-accent" />
                    {imp.suggestion}
                  </h5>
                  <Badge variant="outline" className="text-[10px] uppercase border-accent/30 text-accent">
                    {imp.impact}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="font-bold text-[10px] text-slate-400 uppercase block mb-1">Rational</span>
                  {imp.reason}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle icon={Code2}>Refactored Code</SectionTitle>
        <CodeBlock code={data.refactoredSnippet} title="Optimized Implementation" />
      </section>
    </div>
  );
}
