"use client";

import { useState } from "react";
import { Check, Copy, AlertCircle, Info, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SeverityBadge({ severity }: { severity?: string }) {
  const s = severity?.toLowerCase();
  switch (s) {
    case 'high':
      return <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">High</Badge>;
    case 'medium':
      return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Medium</Badge>;
    case 'low':
      return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Low</Badge>;
    default:
      return <Badge variant="secondary">Info</Badge>;
  }
}

export function CodeBlock({ code, title }: { code?: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!code) return null;

  return (
    <div className="group relative mt-4 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {title || "Corrected Code"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-code text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export function SectionTitle({ children, icon: Icon }: { children: React.ReactNode; icon: any }) {
  return (
    <h4 className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-3">
      <Icon className="h-3.5 w-3.5 text-accent" />
      {children}
    </h4>
  );
}
