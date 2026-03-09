"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Bug, Search, Wrench, CheckCircle2 } from "lucide-react";
import { SectionTitle, SeverityBadge, CodeBlock } from "./shared";

interface DebugData {
  identifiedIssues: Array<{ severity: string; issue: string; line?: string }>;
  rootCause: string;
  fix: string;
  correctedCode: string;
}

export function DebugPanel({ data }: { data: DebugData }) {
  if (!data) return <p className="text-sm text-muted-foreground italic p-4">Waiting for Sensei's analysis...</p>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <section>
        <SectionTitle icon={Bug}>Identified Issues</SectionTitle>
        <div className="space-y-3">
          {data.identifiedIssues?.map((issue, idx) => (
            <Card key={idx} className="border-primary/5 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b">
                <SeverityBadge severity={issue.severity} />
                {issue.line && <span className="text-[10px] text-slate-400 font-code">Line: {issue.line}</span>}
              </div>
              <CardContent className="p-3">
                <p className="text-xs text-slate-600 leading-relaxed">{issue.issue}</p>
              </CardContent>
            </Card>
          ))}
          {(!data.identifiedIssues || data.identifiedIssues.length === 0) && (
            <p className="text-xs text-green-600 font-medium">No critical issues identified.</p>
          )}
        </div>
      </section>

      <section>
        <SectionTitle icon={Search}>Root Cause</SectionTitle>
        <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 text-sm text-slate-700 leading-relaxed">
          {data.rootCause || "Analysis in progress..."}
        </div>
      </section>

      <section>
        <SectionTitle icon={Wrench}>The Fix</SectionTitle>
        <div className="p-4 rounded-xl bg-green-50/50 border border-green-100 text-sm text-slate-700 leading-relaxed">
          {data.fix || "Generating fix..."}
        </div>
      </section>

      <section>
        <SectionTitle icon={CheckCircle2}>Corrected Code</SectionTitle>
        <CodeBlock code={data.correctedCode} />
      </section>
    </div>
  );
}
