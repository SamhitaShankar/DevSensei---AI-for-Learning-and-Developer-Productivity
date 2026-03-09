
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, BrainCircuit, GraduationCap, ArrowRight, ShieldAlert, Wand2, User, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { analyzeCode, type AnalyzeCodeOutput } from "@/ai/flows/analyze-code-flow";

// Dynamic Feature Panels
import { ArchitecturePanel } from "./panels/architecture-panel";
import { ExplanationPanel } from "./panels/explanation-panel";
import { DebugPanel } from "./panels/debug-panel";
import { ImprovementsPanel } from "./panels/improvements-panel";
import { FeaturesPanel } from "./panels/features-panel";

interface Message {
  role: 'user' | 'assistant';
  content: string | AnalyzeCodeOutput | any;
  type: 'explanation' | 'text';
}

interface ActionState {
  type: string;
  code: string;
  timestamp: number;
  repoTree?: string;
}

interface AIChatProps {
  lastAction?: ActionState;
  onAnalysisComplete?: (feature: FeatureType, content: any) => void;
  onAnalysisStart?: (feature: FeatureType) => void;
}

export type FeatureType = 
  | 'explain_repo_architecture' 
  | 'explain_selected_code' 
  | 'debug_selected_code' 
  | 'suggest_improvements' 
  | 'generate_features' 
  | 'general';

export function AIChat({ lastAction, onAnalysisComplete, onAnalysisStart }: AIChatProps) {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);
  const isLoading = loadingCount > 0;
  
  const [featureMessages, setFeatureMessages] = useState<Record<string, Message[]>>({
    general: [{ role: 'assistant', content: "Greetings. I am your DevSensei. Select a file or code action, and I will guide you through its mysteries.", type: 'text' }],
    explain_repo_architecture: [{ role: 'assistant', content: "Architecture Mode: I am analyzing your project structure.", type: 'text' }],
    explain_selected_code: [{ role: 'assistant', content: "Explanation Mode: I will provide insights for your selections.", type: 'text' }],
    debug_selected_code: [{ role: 'assistant', content: "Debug Mode: I'll help you find bugs and logic errors.", type: 'text' }],
    suggest_improvements: [{ role: 'assistant', content: "Improve Mode: Let's optimize your code for performance.", type: 'text' }],
    generate_features: [{ role: 'assistant', content: "Feature Mode: I can help you scaffold new logic.", type: 'text' }],
  });

  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRequestIdRef = useRef<number>(0);

  const activeFeature = (lastAction?.type as FeatureType) || 'general';
  const currentMessages = featureMessages[activeFeature] || featureMessages.general;

  useEffect(() => {
    if (scrollRef.current) {
      const scrollArea = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        requestAnimationFrame(() => {
          scrollArea.scrollTop = scrollArea.scrollHeight;
        });
      }
    }
  }, [currentMessages, isLoading]);

  useEffect(() => {
    if (lastAction) {
      handleAnalyzeCode(lastAction.code, lastAction.type as any, lastAction.repoTree);
    }
  }, [lastAction]);

  const getContextHistory = (messages: Message[]) => {
    return messages
      .filter(m => m.type !== 'text' || m.role === 'user')
      .slice(-10) // Increased for better context
      .map(m => ({
        role: m.role,
        content: m.role === 'assistant' ? JSON.stringify(m.content) : m.content
      }));
  };

  async function handleAnalyzeCode(code: string, action: FeatureType, repoTree?: string) {
    const requestId = ++activeRequestIdRef.current;
    setLoadingCount(prev => prev + 1);
    onAnalysisStart?.(action);
    
    const userMsgText = action === 'explain_repo_architecture' 
      ? "Explain the architecture of this repository" 
      : `${action.split('_').join(' ')} requested for selection.`;

    const newUserMsg: Message = { 
      role: 'user', 
      content: userMsgText,
      type: 'text' 
    };
    
    setFeatureMessages(prev => ({
      ...prev,
      [action]: [...(prev[action] || []), newUserMsg]
    }));

    try {
      const history = getContextHistory([...(featureMessages[action] || []), newUserMsg]);

      const result = await analyzeCode({
        selectedCode: code,
        feature: action,
        difficulty: isAdvanced,
        userMessage: userMsgText,
        conversationHistory: history,
        repoTree: repoTree
      });

      if (requestId === activeRequestIdRef.current) {
        setFeatureMessages(prev => ({
          ...prev,
          [action]: [
            ...(prev[action] || []),
            {
              role: 'assistant',
              content: result.content,
              type: result.type === 'fallback' ? 'text' : 'explanation'
            }
          ]
        }));
        
        if (result.type !== 'fallback') {
          onAnalysisComplete?.(action, result.content);
        }
      }
    } catch (error) {
      if (requestId === activeRequestIdRef.current) {
        setFeatureMessages(prev => ({
          ...prev,
          [action]: [
            ...(prev[action] || []),
            {
              role: 'assistant',
              content: "I apologize, but I encountered a disturbance in the flow. Please try your request again.",
              type: 'text'
            }
          ]
        }));
      }
    } finally {
      setLoadingCount(prev => Math.max(0, prev - 1));
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const requestId = ++activeRequestIdRef.current;
    const userMsg = inputValue;
    const action = activeFeature;
    setInputValue("");
    
    const newUserMsg: Message = { role: 'user', content: userMsg, type: 'text' };
    
    setFeatureMessages(prev => ({
      ...prev,
      [action]: [...(prev[action] || []), newUserMsg]
    }));

    setLoadingCount(prev => prev + 1);
    onAnalysisStart?.(action);

    try {
      const history = getContextHistory([...(featureMessages[action] || []), newUserMsg]);

      const result = await analyzeCode({
        selectedCode: lastAction?.code || "", 
        feature: action,
        difficulty: isAdvanced,
        userMessage: userMsg,
        conversationHistory: history,
        repoTree: lastAction?.repoTree
      });

      if (requestId === activeRequestIdRef.current) {
        setFeatureMessages(prev => ({
          ...prev,
          [action]: [...(prev[action] || []), { 
            role: 'assistant', 
            content: result.content,
            type: result.type === 'fallback' ? 'text' : 'explanation' 
          }]
        }));

        if (result.type !== 'fallback') {
          onAnalysisComplete?.(action, result.content);
        }
      }
    } catch (error) {
      if (requestId === activeRequestIdRef.current) {
        setFeatureMessages(prev => ({
          ...prev,
          [action]: [...(prev[action] || []), { 
            role: 'assistant', 
            content: "I am having trouble processing your query at this moment.",
            type: 'text' 
          }]
        }));
      }
    } finally {
      setLoadingCount(prev => Math.max(0, prev - 1));
    }
  };

  const getActionIcon = (action?: string) => {
    switch (action) {
      case 'debug_selected_code': return <ShieldAlert className="h-4 w-4" />;
      case 'suggest_improvements': return <Sparkles className="h-4 w-4" />;
      case 'generate_features': return <Wand2 className="h-4 w-4" />;
      default: return <GraduationCap className="h-4 w-4" />;
    }
  };

  const renderStructuredContent = (feature: string, content: any) => {
    switch (feature) {
      case 'explain_repo_architecture':
        return <ArchitecturePanel data={content} />;
      case 'explain_selected_code':
        return <ExplanationPanel data={content} />;
      case 'debug_selected_code':
        return <DebugPanel data={content} />;
      case 'suggest_improvements':
        return <ImprovementsPanel data={content} />;
      case 'generate_features':
        return <FeaturesPanel data={content} />;
      default:
        return <p className="text-slate-600">{JSON.stringify(content)}</p>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-primary/5 shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-primary/5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            {getActionIcon(activeFeature)}
          </div>
          <h3 className="font-bold text-xs text-primary uppercase tracking-widest">
            {activeFeature === 'general' ? 'Sensei Assistant' : activeFeature.split('_').join(' ')}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="mode-toggle" className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
            {isAdvanced ? "Advanced" : "Beginner"}
          </Label>
          <Switch 
            id="mode-toggle" 
            checked={isAdvanced} 
            onCheckedChange={setIsAdvanced} 
            className="data-[state=checked]:bg-accent scale-75"
            disabled={isLoading}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-8 pt-2">
          {currentMessages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-3", msg.role === 'user' && "flex-row-reverse")}>
              <Avatar className={cn(
                "h-8 w-8 mt-1 shadow-sm border",
                msg.role === 'assistant' ? "border-primary/10" : "border-accent/20"
              )}>
                {msg.role === 'assistant' ? (
                  <>
                    <AvatarImage src="https://picsum.photos/seed/sensei/100/100" />
                    <AvatarFallback>AI</AvatarFallback>
                  </>
                ) : (
                  <AvatarFallback className="bg-accent/10 text-accent">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className={cn("flex-1 max-w-[90%] space-y-2", msg.role === 'user' && "text-right")}>
                <div className={cn(
                  "rounded-2xl p-4 text-sm leading-relaxed border",
                  msg.role === 'assistant' 
                    ? "bg-white text-slate-800 border-primary/10 shadow-sm" 
                    : "bg-accent text-accent-foreground border-accent/20 ml-auto rounded-tr-none shadow-sm"
                )}>
                  {msg.type === 'text' ? (
                    <p>{typeof msg.content === 'string' ? msg.content : (msg.content?.raw || "Analysis ready.")}</p>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500 text-left">
                      <p className="font-medium text-accent flex items-center gap-1.5 mb-2 capitalize border-b border-accent/5 pb-2">
                        <BrainCircuit className="h-4 w-4" />
                        Sensei Insight
                      </p>
                      
                      {msg.content?.error ? (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-2">
                          <p className="flex items-center gap-2 text-red-600 font-bold text-xs">
                            <AlertTriangle className="h-4 w-4" />
                            Structured response failed
                          </p>
                          <pre className="text-[10px] text-red-400 font-code overflow-x-auto p-2 bg-white rounded border border-red-50">
                            {msg.content.raw}
                          </pre>
                        </div>
                      ) : (
                        renderStructuredContent(activeFeature, msg.content)
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-pulse pb-4">
              <Avatar className="h-8 w-8 mt-1 border border-primary/10">
                <AvatarFallback className="bg-primary/5"><Loader2 className="h-4 w-4 animate-spin text-primary" /></AvatarFallback>
              </Avatar>
              <div className="flex-1 max-w-[85%] bg-primary/5 rounded-2xl p-4 border border-primary/10">
                <div className="flex items-center gap-2 text-primary font-medium text-xs mb-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Sensei is thinking...
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-primary/10 rounded" />
                  <div className="h-2 w-3/4 bg-primary/10 rounded" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/30">
        <form 
          className="relative" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input 
            className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 pr-12 shadow-inner disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed"
            placeholder={isLoading ? "Sensei is thinking..." : `Ask about ${activeFeature.split('_').join(' ')}...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="submit"
            size="icon" 
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary hover:bg-accent rounded-lg transition-colors disabled:opacity-50"
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
