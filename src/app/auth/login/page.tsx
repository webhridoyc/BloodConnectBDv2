
import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";

export const metadata: Metadata = {
  title: "Login | BloodLink BD",
  description: "Login to your BloodLink BD account.",
};

export default function LoginPage() {
  return (
    <Card className="w-full shadow-xl animate-fade-in-up">
      <CardHeader className="text-center">
        <LogIn className="mx-auto h-10 w-10 text-primary mb-3" />
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Sign in to access your account and continue saving lives.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Placeholder for login form */}
        <div className="text-center text-muted-foreground py-6">
          <p>Login form will be here soon.</p>
          <p> (e.g., Email, Password, Login Button, Google Sign-In)</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Login (Coming Soon)
        </Button>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Button variant="link" asChild className="px-0 text-primary">
            <Link href="/auth/register">Sign up</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
