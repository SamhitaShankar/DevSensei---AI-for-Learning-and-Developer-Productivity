"use client";

import { BrainCircuit, ShieldAlert, Sparkles, FileCheck, ClipboardList } from "lucide-react";
import { SectionTitle } from "./shared";

interface ExplanationData {
  summary: string;
  detailedExplanation: string;
  codeQuality: any;
  maintainabilityNotes: any;
  edgeCases: string[];
}

export function ExplanationPanel({ data }: { data: ExplanationData }) {
  if (!data) return <p className="text-sm text-muted-foreground italic p-4">Waiting for Sensei's analysis...</p>;

  // Helper to safely render strings or objects returned by the LLM
  const renderValue = (val: any) => {
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val !== null) {
      return (
        <div className="space-y-1">
          {Object.entries(val).map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="font-bold capitalize min-w-[80px] text-primary/70">{key}:</span>
              <span>{typeof value === 'string' ? value : JSON.stringify(value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return String(val || "");
  };

  const detailedExplanationStr = renderValue(data.detailedExplanation);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <section>
        <SectionTitle icon={Sparkles}>Summary</SectionTitle>
        <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-sm font-medium text-slate-800 italic">
          "{data.summary || "Generating summary..."}"
        </div>
      </section>

      <section>
        <SectionTitle icon={BrainCircuit}>Detailed Explanation</SectionTitle>
        <div className="text-sm leading-relaxed text-slate-600 space-y-2 bg-white p-4 rounded-xl border border-primary/5 shadow-sm">
          {typeof detailedExplanationStr === 'string' ? (
            detailedExplanationStr.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))
          ) : (
            renderValue(data.detailedExplanation)
          ) || <p>The Sensei is contemplating the logic...</p>}
        </div>
      </section>

      <section>
        <SectionTitle icon={FileCheck}>Code Quality</SectionTitle>
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-xs leading-relaxed text-slate-700">
          {renderValue(data.codeQuality) || "Analysis of readability and structure pending..."}
        </div>
      </section>

      <section>
        <SectionTitle icon={ClipboardList}>Maintainability</SectionTitle>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-600">
          {renderValue(data.maintainabilityNotes) || "Long-term suggestions are being formulated..."}
        </div>
      </section>

      {data.edgeCases && data.edgeCases.length > 0 && (
        <section>
          <SectionTitle icon={ShieldAlert}>Edge Cases</SectionTitle>
          <ul className="grid grid-cols-1 gap-2">
            {data.edgeCases.map((edge, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                {edge}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}