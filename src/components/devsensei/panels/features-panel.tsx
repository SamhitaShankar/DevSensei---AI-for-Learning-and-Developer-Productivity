"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Star, Construction, LayoutGrid } from "lucide-react";
import { SectionTitle } from "./shared";

interface FeatureIdea {
  featureName: string;
  description: string;
  implementationHint: string;
}

interface FeaturesData {
  featureIdeas: FeatureIdea[];
  priorityRecommendation: string;
}

export function FeaturesPanel({ data }: { data: FeaturesData }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <section>
        <SectionTitle icon={LayoutGrid}>Feature Ideas</SectionTitle>
        <div className="grid grid-cols-1 gap-4">
          {data.featureIdeas?.map((idea, idx) => (
            <Card key={idx} className="border-primary/5 shadow-sm hover:border-accent/30 transition-colors">
              <CardContent className="p-4 space-y-3">
                <h5 className="font-bold text-sm text-primary flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  {idea.featureName}
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {idea.description}
                </p>
                <div className="flex items-start gap-2 text-xs text-accent bg-accent/5 p-2 rounded-lg border border-accent/10">
                  <Construction className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[10px] uppercase block mb-0.5">Implementation Hint</span>
                    {idea.implementationHint}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle icon={Star}>Recommended Priority</SectionTitle>
        <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-sm text-slate-800 font-medium shadow-sm">
          {data.priorityRecommendation}
        </div>
      </section>
    </div>
  );
}
