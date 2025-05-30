
import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building } from "lucide-react";

export const metadata: Metadata = {
  title: "Hospitals & Blood Banks | BloodLink BD",
  description: "Find hospitals and blood banks near you.",
};

export default function HospitalsPage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8 animate-fade-in-up">
        <Building className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Hospitals & <span className="text-primary">Blood Banks</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Information about hospitals and blood banks will be available here.
        </p>
      </section>

      <section className="animate-fade-in-up-delayed-1">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Under Construction</CardTitle>
            <CardDescription>
              This page is currently under development. Please check back later for a list of hospitals and blood banks.
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
