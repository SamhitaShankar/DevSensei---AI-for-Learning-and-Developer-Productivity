
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Network, Compass, Layers, Zap, Lightbulb, Loader2, Cpu, LayoutGrid, Key, Star, Wrench, FileCode, Folder } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

interface ArchitectureOverviewProps {
  data?: ArchitectureData;
  isLoading?: boolean;
}

function SectionWrapper({ title, icon: Icon, children, delayClass }: { title: string, icon: any, children: React.ReactNode, delayClass?: string }) {
  return (
    <section className={cn("animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden", delayClass)}>
      <h3 className="text-base md:text-lg font-bold text-primary flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-accent shrink-0" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function EmptyState({ message = "No information available for this section." }: { message?: string }) {
  return <p className="text-xs text-muted-foreground italic p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">{message}</p>;
}

export function ArchitectureOverview({ data, isLoading }: ArchitectureOverviewProps) {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-card rounded-xl border border-primary/5 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-accent" />
        <p className="text-sm font-medium animate-pulse px-4 text-center">Sensei is mapping the repository's soul...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-card rounded-xl border border-primary/5 text-muted-foreground italic p-8 text-center">
        <Compass className="h-12 w-12 mb-4 opacity-20" />
        <p>Select "Explain Architecture" from the file tree to begin analysis.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-primary/5 shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b bg-white flex items-center gap-3 shrink-0">
        <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
          <Network className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg md:text-xl font-bold text-primary truncate">Repository Architecture</h2>
          <p className="text-xs text-muted-foreground truncate">AI-Generated Intelligence Report</p>
        </div>
      </div>

      <ScrollArea className="flex-1 bg-slate-50/50">
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-12 pb-20">
          
          <SectionWrapper title="1. Architecture Overview" icon={Compass}>
            <div className="p-4 md:p-5 rounded-xl bg-white border border-primary/10 shadow-sm text-slate-700 leading-relaxed text-sm">
              {data.architectureOverview || <EmptyState />}
            </div>
          </SectionWrapper>

          <SectionWrapper title="2. Tech Stack" icon={Cpu} delayClass="delay-75">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['languages', 'frameworks', 'libraries', 'tools'].map((category) => (
                <Card key={category} className="border-primary/5 shadow-sm">
                  <CardContent className="p-4">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">{category}</h5>
                    <div className="flex flex-wrap gap-2">
                      {data.techStack?.[category as keyof typeof data.techStack]?.length ? (
                        data.techStack[category as keyof typeof data.techStack].map((item, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10">
                            {item}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">None listed</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper title="3. Project Structure" icon={LayoutGrid} delayClass="delay-100">
            <div className="space-y-3">
              {data.projectStructure?.length ? (
                data.projectStructure.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg group hover:border-accent/30 transition-colors">
                    {item.type === 'folder' ? <Folder className="h-4 w-4 text-accent mt-0.5 shrink-0" /> : <FileCode className="h-4 w-4 text-primary/40 mt-0.5 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-xs font-code font-bold text-slate-700 truncate">{item.path}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))
              ) : <EmptyState />}
            </div>
          </SectionWrapper>

          <SectionWrapper title="4. Core Modules" icon={Layers} delayClass="delay-150">
            <div className="grid grid-cols-1 gap-4">
              {data.coreModules?.length ? (
                data.coreModules.map((mod, idx) => (
                  <Card key={idx} className="border-primary/5 shadow-sm hover:border-accent/30 transition-colors">
                    <CardContent className="p-4">
                      <h5 className="font-bold text-sm text-primary mb-1">{mod.name}</h5>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{mod.purpose}</p>
                      {mod.importantFiles?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                          {mod.importantFiles.map((file, fIdx) => (
                            <span key={fIdx} className="text-[10px] font-code bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-slate-500">
                              {file}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : <EmptyState />}
            </div>
          </SectionWrapper>

          <SectionWrapper title="5. Data Flow & Management" icon={Zap} delayClass="delay-200">
            <div className="p-4 md:p-5 rounded-xl bg-accent/5 border border-accent/10 text-sm leading-relaxed text-slate-700">
              {data.dataFlow || <EmptyState />}
            </div>
          </SectionWrapper>

          <SectionWrapper title="6. Entry Points" icon={Key} delayClass="delay-300">
            <div className="flex flex-wrap gap-2">
              {data.entryPoints?.length ? (
                data.entryPoints.map((entry, idx) => (
                  <div key={idx} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-code text-slate-600 break-all">
                    {entry}
                  </div>
                ))
              ) : <EmptyState />}
            </div>
          </SectionWrapper>

          <SectionWrapper title="7. Design Patterns" icon={Star} delayClass="delay-400">
            <div className="flex flex-wrap gap-2">
              {data.designPatterns?.length ? (
                data.designPatterns.map((pattern, idx) => (
                  <Badge key={idx} className="bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100 py-1.5 px-3">
                    {pattern}
                  </Badge>
                ))
              ) : <EmptyState />}
            </div>
          </SectionWrapper>

          <SectionWrapper title="8. Potential Improvements" icon={Wrench} delayClass="delay-500">
            <div className="space-y-4">
              {data.potentialImprovements?.length ? (
                data.potentialImprovements.map((imp, idx) => (
                  <Card key={idx} className="border-green-100 bg-green-50/20 shadow-none">
                    <CardContent className="p-4">
                      <h5 className="font-bold text-sm text-green-800 mb-1">{imp.suggestion}</h5>
                      <p className="text-xs text-green-700/80 leading-relaxed italic">{imp.reason}</p>
                    </CardContent>
                  </Card>
                ))
              ) : <EmptyState />}
            </div>
          </SectionWrapper>

          <div className="pt-12 border-t border-slate-200 flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              This intelligence report was generated by DevSensei analyzing your current repository state and full recursive file tree.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
