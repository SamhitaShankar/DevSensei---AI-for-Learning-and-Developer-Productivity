
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Network, Layers, GitBranch, Compass, Cpu, LayoutGrid, Zap, Key, Star, Wrench, FileCode, Folder } from "lucide-react";
import { SectionTitle } from "./shared";
import { Badge } from "@/components/ui/badge";

interface ArchitectureData {
  architectureOverview: string;
  techStack: {
    languages: string[];
    frameworks: string[];
    libraries: string[];
    tools: string[];
  };
  projectStructure: Array<{
    path: string;
    type: "file" | "folder";
    description: string;
  }>;
  coreModules: Array<{
    name: string;
    purpose: string;
    importantFiles: string[];
  }>;
  dataFlow: string;
  entryPoints: string[];
  designPatterns: string[];
  potentialImprovements: Array<{
    suggestion: string;
    reason: string;
  }>;
}

export function ArchitecturePanel({ data }: { data: ArchitectureData }) {
  if (!data) return <p className="text-xs text-muted-foreground italic">No analysis data available.</p>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden">
      <section>
        <SectionTitle icon={Compass}>Overview</SectionTitle>
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-xs leading-relaxed text-slate-700">
          {data.architectureOverview || "No overview available."}
        </div>
      </section>

      <section>
        <SectionTitle icon={Cpu}>Tech Stack</SectionTitle>
        <div className="space-y-2">
          {['languages', 'frameworks', 'libraries', 'tools'].map((cat) => {
            const items = data.techStack?.[cat as keyof typeof data.techStack];
            if (!items?.length) return null;
            return (
              <div key={cat} className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 w-full mb-0.5">{cat}</span>
                {items.map((item, idx) => (
                  <Badge key={idx} variant="outline" className="text-[10px] bg-white border-slate-200">
                    {item}
                  </Badge>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle icon={LayoutGrid}>Project Structure</SectionTitle>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {data.projectStructure?.slice(0, 10).map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded border border-slate-100">
              {item.type === 'folder' ? <Folder className="h-3 w-3 text-accent shrink-0 mt-0.5" /> : <FileCode className="h-3 w-3 text-slate-300 shrink-0 mt-0.5" />}
              <div className="min-w-0">
                <p className="text-[10px] font-code font-bold truncate">{item.path}</p>
                <p className="text-[9px] text-muted-foreground truncate">{item.description}</p>
              </div>
            </div>
          ))}
          {data.projectStructure?.length > 10 && (
            <p className="text-[9px] text-center text-muted-foreground">+{data.projectStructure.length - 10} more files</p>
          )}
        </div>
      </section>

      <section>
        <SectionTitle icon={Layers}>Core Modules</SectionTitle>
        <div className="space-y-3">
          {data.coreModules?.map((mod, idx) => (
            <Card key={idx} className="border-primary/5 shadow-none bg-white">
              <CardContent className="p-3">
                <h5 className="font-bold text-xs text-primary mb-1">{mod.name}</h5>
                <p className="text-[10px] text-muted-foreground leading-tight mb-2">{mod.purpose}</p>
                {mod.importantFiles?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {mod.importantFiles.map((file, fIdx) => (
                      <span key={fIdx} className="text-[8px] font-code bg-slate-50 px-1 py-0.5 rounded border border-slate-100 text-slate-400">
                        {file}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle icon={Zap}>Data Flow</SectionTitle>
        <div className="p-3 rounded-xl bg-accent/5 border border-accent/10 text-xs text-slate-700 leading-relaxed">
          {data.dataFlow || "No flow data provided."}
        </div>
      </section>

      <section>
        <SectionTitle icon={Wrench}>Potential Improvements</SectionTitle>
        <div className="space-y-2">
          {data.potentialImprovements?.map((imp, idx) => (
            <div key={idx} className="p-2 rounded-lg bg-green-50 border border-green-100 text-[10px] text-green-800">
              <span className="font-bold block mb-0.5">{imp.suggestion}</span>
              <span className="opacity-80 italic">{imp.reason}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
