"use client";

import { useState, useEffect } from "react";
import { Repository, FileNode } from "@/lib/mock-data";
import { FileTree } from "./file-tree";
import { CodeViewer } from "./code-viewer";
import { AIChat, type FeatureType } from "./ai-chat";
import { ArchitectureOverview } from "./architecture-overview";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { analyzeCode } from "@/ai/flows/analyze-code-flow";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ActionState {
  type: string;
  code: string;
  timestamp: number;
  repoTree?: string;
}

interface RepoViewProps {
  repo: Repository;
  onBack: () => void;
}

export function RepoView({ repo, onBack }: RepoViewProps) {
  const { toast } = useToast();

  const [tree, setTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | undefined>();
  const [lastAction, setLastAction] = useState<ActionState | undefined>();
  const [viewMode, setViewMode] = useState<"code" | "architecture">("code");
  const [loading, setLoading] = useState(true);

  const [architectureData, setArchitectureData] = useState<any>(null);
  const [isAnalyzingArchitecture, setIsAnalyzingArchitecture] = useState(false);

  // Normalize owner (GitHub API sometimes returns owner object)
  const ownerName =
  typeof repo.owner === "string"
    ? repo.owner
    : (repo.owner as any)?.login;

  useEffect(() => {
    setSelectedFile(undefined);
    setLastAction(undefined);
    setViewMode("code");
    setArchitectureData(null);
    setIsAnalyzingArchitecture(false);

    async function fetchRoot() {
      setLoading(true);

      try {
        const res = await fetch(`/api/repo/${ownerName}/${repo.name}?path=`);

        if (res.ok) {
          const data = await res.json();
          setTree(Array.isArray(data) ? data : []);
        } else {
          throw new Error(`Failed to fetch repo root: ${res.status}`);
        }
      } catch (err: any) {
        console.error(err);

        toast({
          title: "Error",
          description: `Could not load repository files. ${err.message}`,
          variant: "destructive",
        });

        setTree([]);
      } finally {
        setLoading(false);
      }
    }

    if (ownerName && repo.name) {
      fetchRoot();
    }
  }, [repo, ownerName, toast]);

  const handleAction = (type: string, code: string, repoTree?: string) => {
    setLastAction({
      type,
      code,
      repoTree,
      timestamp: Date.now(),
    });
  };

  const handleSelectFile = async (file: FileNode) => {
    if (file.type === "file") {
      try {
        const res = await fetch(
          `/api/repo/${ownerName}/${repo.name}?path=${encodeURIComponent(
            file.path
          )}`
        );

        if (res.ok) {
          const data = await res.json();

          const decodedContent = data.content
            ? atob(data.content.replace(/\s/g, ""))
            : "";

          setSelectedFile({ ...file, content: decodedContent });
          setViewMode("code");
        } else {
          throw new Error(`Failed to fetch file content: ${res.status}`);
        }
      } catch (err: any) {
        console.error(err);

        toast({
          title: "Error",
          description: `Could not load file content. ${err.message}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleFetchChildren = async (path: string): Promise<FileNode[]> => {
    try {
      const res = await fetch(
        `/api/repo/${ownerName}/${repo.name}?path=${encodeURIComponent(path)}`
      );

      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch (err) {
      console.error("Failed to fetch folder children", err);
    }

    return [];
  };

  const handleShowArchitecture = async () => {
    if (viewMode === "architecture" && architectureData) return;

    setViewMode("architecture");
    setSelectedFile(undefined);
    setIsAnalyzingArchitecture(true);

    try {
      const res = await fetch(`/api/repo/${ownerName}/${repo.name}?tree=true`);

      if (res.ok) {
        const fullItems = await res.json();

        const treeString = fullItems
          .map((item: { path: string }) => item.path)
          .join("\n");

        const result = await analyzeCode({
          selectedCode: "Full Repository Analysis",
          feature: "explain_repo_architecture",
          difficulty: true,
          userMessage: "Explain the architecture of this repository",
          repoTree: treeString,
        });

        if (result.type !== "fallback") {
          setArchitectureData(result.content);
        } else {
          throw new Error(result.raw || "Analysis failed");
        }
      } else {
        throw new Error("Failed to fetch full repository tree");
      }
    } catch (err: any) {
      console.error("Architecture analysis failed", err);

      toast({
        title: "Analysis Error",
        description: `Could not analyze repository architecture. ${err.message}`,
        variant: "destructive",
      });

      setArchitectureData(null);
    } finally {
      setIsAnalyzingArchitecture(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-primary rounded-lg"
          >
            Back to Dashboard
          </Button>

          <div className="h-6 w-[1px] bg-border mx-2" />

          <h2 className="text-xl font-bold text-primary">{repo.name}</h2>

          <span className="text-xs px-2 py-0.5 bg-primary/5 text-primary rounded border border-primary/10 font-medium">
            Main
          </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-4 p-4 min-h-0 bg-background">
        <div className="col-span-12 md:col-span-3 lg:col-span-2 overflow-hidden h-full">
          <FileTree
            tree={tree}
            onSelectFile={handleSelectFile}
            selectedFile={selectedFile}
            onShowArchitecture={handleShowArchitecture}
            onFetchChildren={handleFetchChildren}
          />
        </div>

        <div
          className={cn(
            "col-span-12 overflow-hidden h-full transition-all duration-300",
            viewMode === "code"
              ? "md:col-span-9 lg:col-span-6"
              : "md:col-span-9 lg:col-span-10"
          )}
        >
          {viewMode === "code" ? (
            <CodeViewer
              file={selectedFile}
              onAction={handleAction}
              currentAction={lastAction?.type}
            />
          ) : (
            <ArchitectureOverview
              data={architectureData}
              isLoading={isAnalyzingArchitecture}
            />
          )}
        </div>

        {viewMode === "code" && (
          <div className="col-span-12 lg:col-span-4 overflow-hidden h-full">
            <AIChat lastAction={lastAction} />
          </div>
        )}
      </div>
    </div>
  );
}