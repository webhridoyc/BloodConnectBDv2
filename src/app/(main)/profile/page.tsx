
import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export const metadata: Metadata = {
  title: "User Profile | BloodLink BD",
  description: "Manage your BloodLink BD user profile.",
};

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8 animate-fade-in-up">
        <User className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          User <span className="text-primary">Profile</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          View and update your profile information.
        </p>
      </section>

      <section className="animate-fade-in-up-delayed-1">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Profile Management</CardTitle>
            <CardDescription>
              This page is under construction. Profile editing features will be available soon.
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
