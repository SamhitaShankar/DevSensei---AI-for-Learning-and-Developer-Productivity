
"use client";

import { useState } from "react";
import { FileNode } from "@/lib/mock-data";
import { ChevronDown, ChevronRight, FileCode, Folder, FolderOpen, Network, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileTreeItemProps {
  node: FileNode;
  level: number;
  onSelectFile: (file: FileNode) => void;
  selectedFile?: FileNode;
  onFetchChildren: (path: string) => Promise<FileNode[]>;
}

function FileTreeItem({ node, level, onSelectFile, selectedFile, onFetchChildren }: FileTreeItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState<FileNode[]>(node.children || []);
  const [hasLoaded, setHasLoaded] = useState(!!node.children);

  const isSelected = selectedFile?.path === node.path && node.type === 'file';

  const handleClick = async () => {
    if (node.type === 'folder') {
      if (!isOpen && !hasLoaded) {
        setIsLoading(true);
        const fetchedChildren = await onFetchChildren(node.path);
        setChildren(fetchedChildren);
        setHasLoaded(true);
        setIsLoading(false);
      }
      setIsOpen(!isOpen);
    } else {
      onSelectFile(node);
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-3 cursor-pointer hover:bg-primary/5 transition-colors rounded-lg group",
          isSelected && "bg-accent/10 text-accent font-medium",
          level > 0 && "ml-2"
        )}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        onClick={handleClick}
      >
        <span className="text-muted-foreground">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : node.type === 'folder' ? (
            isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="w-4" />
          )}
        </span>
        
        {node.type === 'folder' ? (
          isOpen ? <FolderOpen className="h-4 w-4 text-accent" /> : <Folder className="h-4 w-4 text-primary/60" />
        ) : (
          <FileCode className={cn("h-4 w-4", isSelected ? "text-accent" : "text-muted-foreground")} />
        )}
        
        <span className="text-sm truncate">{node.name}</span>
      </div>

      {node.type === 'folder' && isOpen && children.length > 0 && (
        <div className="mt-0.5">
          {children.map((child, idx) => (
            <FileTreeItem 
              key={`${child.path}-${idx}`} 
              node={child} 
              level={level + 1} 
              onSelectFile={onSelectFile}
              selectedFile={selectedFile}
              onFetchChildren={onFetchChildren}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FileTreeProps {
  tree: FileNode[];
  onSelectFile: (file: FileNode) => void;
  selectedFile?: FileNode;
  onShowArchitecture: () => void;
  onFetchChildren: (path: string) => Promise<FileNode[]>;
}

export function FileTree({ tree, onSelectFile, selectedFile, onShowArchitecture, onFetchChildren }: FileTreeProps) {
  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-primary/5 shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-primary/5">
        <h3 className="font-bold text-sm text-primary uppercase tracking-wider">File Explorer</h3>
      </div>
      
      <div className="p-4 border-b bg-white/50">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-accent bg-accent/5 hover:bg-accent/10 border border-accent/10 rounded-xl py-6 px-4 transition-all group shadow-sm"
          onClick={onShowArchitecture}
        >
          <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Network className="h-4 w-4" />
          </div>
          <span className="text-[10px] leading-tight font-bold uppercase tracking-wider text-left">
            Explain<br />Architecture
          </span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {tree.map((node, idx) => (
          <FileTreeItem 
            key={`${node.path}-${idx}`} 
            node={node} 
            level={0} 
            onSelectFile={onSelectFile}
            selectedFile={selectedFile}
            onFetchChildren={onFetchChildren}
          />
        ))}
        {tree.length === 0 && (
          <div className="p-4 text-center text-xs text-muted-foreground italic">
            No files found in root.
          </div>
        )}
      </div>
    </div>
  );
}
