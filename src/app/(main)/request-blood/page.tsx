
import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Request Blood | BloodLink BD",
  description: "Submit a blood request to find donors.",
};

export default function RequestBloodPage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8 animate-fade-in-up">
        <HeartHandshake className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Request <span className="text-primary">Blood</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Fill out the form below to submit a blood request.
        </p>
      </section>

      <section className="animate-fade-in-up-delayed-1">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Blood Request Form</CardTitle>
            <CardDescription>
              This page is under construction. The blood request form will be available here soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Thank you for your patience!</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
