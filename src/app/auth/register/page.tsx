
import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export const metadata: Metadata = {
  title: "Register | BloodLink BD",
  description: "Create your BloodLink BD account.",
};

export default function RegisterPage() {
  return (
    <Card className="w-full shadow-xl animate-fade-in-up">
      <CardHeader className="text-center">
        <UserPlus className="mx-auto h-10 w-10 text-primary mb-3" />
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>Join BloodLink BD to help save lives or find donors.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Placeholder for registration form */}
        <div className="text-center text-muted-foreground py-6">
          <p>Registration form will be here soon.</p>
          <p>(e.g., Name, Email, Password, Register Button, Google Sign-Up)</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Register (Coming Soon)
        </Button>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" asChild className="px-0 text-primary">
            <Link href="/auth/login">Log in</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
