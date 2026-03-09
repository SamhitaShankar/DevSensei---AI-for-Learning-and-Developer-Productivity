"use client";

import { useState, useEffect, useRef } from "react";
import { FileNode } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { MessageSquareText, Bug, Sparkles, Plus, Edit2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MAX_CODE_LENGTH = 2000;

interface CodeViewerProps {
  file?: FileNode;
  onAction: (type: string, selectedCode: string) => void;
  currentAction?: string;
}

export function CodeViewer({ file, onAction, currentAction }: CodeViewerProps) {
  const [hasSelection, setHasSelection] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (file) {
      setEditedContent(file.content || "");
    }
  }, [file]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const hasText = selection && selection.toString().trim().length > 0;
      
      if (isEditing && textareaRef.current) {
        const { selectionStart, selectionEnd } = textareaRef.current;
        const textareaHasText = selectionStart !== selectionEnd;
        setHasSelection(textareaHasText || !!hasText);
      } else {
        setHasSelection(!!hasText);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    handleSelectionChange();
    
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [isEditing]);

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-card rounded-xl border border-primary/5 text-muted-foreground italic">
        Select a file to view code
      </div>
    );
  }

  const handleButtonClick = (type: string) => {
    let selectedText = "";
    
    if (isEditing && textareaRef.current) {
      const { selectionStart, selectionEnd, value } = textareaRef.current;
      selectedText = value.substring(selectionStart, selectionEnd).trim();
    } else {
      const selection = window.getSelection();
      selectedText = selection ? selection.toString().trim() : "";
    }
    
    if (selectedText) {
      if (selectedText.length > MAX_CODE_LENGTH) {
        toast({
          title: "Large Code Selection",
          description: "Large code selection may increase analysis time or exceed token limits. Consider refining your selection for better results.",
          variant: "default",
        });
      }
      onAction(type, selectedText);
    }
  };

  const lines = (isEditing ? editedContent : (file.content || "")).split('\n');

  return (
    <TooltipProvider delayDuration={0}>
      <div className="h-full flex flex-col bg-card rounded-xl border border-primary/5 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-sm z-10 overflow-x-auto gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(!hasSelection && "cursor-not-allowed")}>
                  <Button 
                    variant="default"
                    size="sm" 
                    disabled={!hasSelection}
                    className={cn(
                      "h-9 px-4 transition-all rounded-[10px] font-medium bg-accent text-accent-foreground hover:bg-accent/90",
                      currentAction === 'explain_selected_code' && hasSelection && "ring-2 ring-accent ring-offset-2"
                    )}
                    onClick={() => handleButtonClick('explain_selected_code')}
                  >
                    <MessageSquareText className="h-4 w-4 mr-2" />
                    Explain Selection
                  </Button>
                </div>
              </TooltipTrigger>
              {!hasSelection && <TooltipContent side="bottom"><p>Select code to activate</p></TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(!hasSelection && "cursor-not-allowed")}>
                  <Button 
                    variant="outline"
                    size="sm" 
                    disabled={!hasSelection}
                    className={cn(
                      "h-9 px-4 transition-all rounded-[10px] font-medium border-primary/10 hover:bg-primary/5",
                      currentAction === 'debug_selected_code' && hasSelection && "bg-primary/5 border-primary/30"
                    )}
                    onClick={() => handleButtonClick('debug_selected_code')}
                  >
                    <Bug className="h-4 w-4 mr-2" />
                    Debug Code
                  </Button>
                </div>
              </TooltipTrigger>
              {!hasSelection && <TooltipContent side="bottom"><p>Select code to activate</p></TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(!hasSelection && "cursor-not-allowed")}>
                  <Button 
                    variant="outline"
                    size="sm" 
                    disabled={!hasSelection}
                    className={cn(
                      "h-9 px-4 transition-all rounded-[10px] font-medium border-primary/10 hover:bg-primary/5",
                      currentAction === 'suggest_improvements' && hasSelection && "bg-primary/5 border-primary/30"
                    )}
                    onClick={() => handleButtonClick('suggest_improvements')}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Suggest Improvements
                  </Button>
                </div>
              </TooltipTrigger>
              {!hasSelection && <TooltipContent side="bottom"><p>Select code to activate</p></TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(!hasSelection && "cursor-not-allowed")}>
                  <Button 
                    variant="outline"
                    size="sm" 
                    disabled={!hasSelection}
                    className={cn(
                      "h-9 px-4 transition-all rounded-[10px] font-medium border-primary/10 hover:bg-primary/5",
                      currentAction === 'generate_features' && hasSelection && "bg-primary/5 border-primary/30"
                    )}
                    onClick={() => handleButtonClick('generate_features')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Feature
                  </Button>
                </div>
              </TooltipTrigger>
              {!hasSelection && <TooltipContent side="bottom"><p>Select code to activate</p></TooltipContent>}
            </Tooltip>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-lg border border-primary/10 shrink-0">
            <Label htmlFor="edit-mode" className="text-[10px] font-bold uppercase cursor-pointer flex items-center gap-1.5 text-primary">
              <Edit2 className="h-3 w-3" />
              Edit Mode
            </Label>
            <Switch 
              id="edit-mode" 
              checked={isEditing} 
              onCheckedChange={setIsEditing} 
              className="scale-75 data-[state=checked]:bg-accent"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 bg-slate-950 text-slate-300 font-code text-sm">
          {isEditing ? (
            <div className="min-h-full">
              <textarea
                ref={textareaRef}
                className="w-full h-full min-h-[500px] bg-transparent p-6 outline-none resize-none font-code text-sm text-slate-300 selection:bg-accent/40 leading-relaxed overflow-x-auto whitespace-pre"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                spellCheck={false}
                placeholder="Edit code here..."
              />
            </div>
          ) : (
            <div className="pt-6 pb-4 px-4 flex w-fit min-w-full">
              <div className="pr-4 text-slate-600 select-none text-right border-r border-slate-800/50 min-w-[3rem] sticky left-0 bg-slate-950 z-10">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <div 
                className="pl-4 whitespace-pre outline-none selection:bg-accent/40 selection:text-white leading-relaxed" 
                tabIndex={0}
              >
                {editedContent || file.content}
              </div>
            </div>
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}