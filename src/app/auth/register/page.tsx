
import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Join BloodLink BD",
  description: "Become a member of the BloodLink BD community.",
};

export default function RegisterPage() {
  return (
    <Card className="w-full shadow-xl animate-fade-in-up">
      <CardHeader className="text-center">
        <Users className="mx-auto h-10 w-10 text-primary mb-3" />
        <CardTitle className="text-2xl">Become a Valued Member</CardTitle>
        <CardDescription>Join the BloodLink BD community to save lives and find support when you need it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Placeholder for registration form */}
        <div className="text-center text-muted-foreground py-6">
          <p>Membership registration form will be here soon.</p>
          <p>(e.g., Name, Email, Password, Register Button, Google Sign-Up)</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <UserPlus className="mr-2 h-4 w-4" /> Join Now (Coming Soon)
        </Button>
        <p className="text-sm text-muted-foreground">
          Already a member?{" "}
          <Button variant="link" asChild className="px-0 text-primary">
            <Link href="/auth/login">Login to your account</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}

