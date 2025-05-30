
import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Matching Tool | BloodLink BD",
  description: "Use our AI tool to find suitable blood donor matches.",
};

export default function AiMatcherPage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8 animate-fade-in-up">
        <Bot className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          AI Matching <span className="text-primary">Tool</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Our intelligent tool helps match donors with requests efficiently.
        </p>
      </section>

      <section className="animate-fade-in-up-delayed-1">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              The AI Matching Tool is under development and will be available here shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Thank you for your understanding!</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
