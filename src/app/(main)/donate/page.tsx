
import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Droplet } from "lucide-react";

export const metadata: Metadata = {
  title: "Become a Donor | BloodLink BD",
  description: "Register as a blood donor and save lives.",
};

export default function DonatePage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8 animate-fade-in-up">
        <Droplet className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Become a <span className="text-primary">Donor</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Join our community of life-savers. Register your details below.
        </p>
      </section>

      <section className="animate-fade-in-up-delayed-1">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Donor Registration</CardTitle>
            <CardDescription>
              This page is under construction. The donor registration form will be available here soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Thank you for your commitment to saving lives!</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
