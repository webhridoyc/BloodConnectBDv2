
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, LogIn, UserPlus, ShieldCheck } from "lucide-react";

const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Min 1, as Firebase handles complexity
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/"); // Redirect if already logged in
    }
  }, [user, authLoading, router]);

  async function onSubmit(data: LoginFormValues) {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: "Login Successful!",
        description: "Welcome back to BloodLink BD.",
      });
      router.push("/"); // Redirect to home page after successful login
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "The email address is not valid.";
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading && !user) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user becomes defined after initial loading, useEffect will handle redirect.
  if (user) {
    return null;
  }

  return (
    <Card className="w-full shadow-xl animate-fade-in-up">
      <CardHeader className="text-center">
        <ShieldCheck className="mx-auto h-10 w-10 text-primary mb-3" />
        <CardTitle className="text-2xl">Welcome Back, Life-Saver!</CardTitle>
        <CardDescription>
          Sign in to access your BloodLink BD membership and continue making a difference.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="member@example.com" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </Form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          disabled={isSubmitting}
          onClick={() => toast({ title: "Coming Soon!", description: "Google Sign-In will be available shortly."})}
        >
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 118.3 512 0 398.5 0 256S118.3 0 244 0c69.9 0 125.5 28.9 165.7 68.6L372.3 112.6C339.2 83.8 296.3 64 244 64c-95.6 0-173.5 78.3-173.5 174.7S148.4 413.4 244 413.4c52.8 0 95.3-22.1 126.8-53.1 26.7-26 42.9-62.1 47.9-99.9H244V261.8h244z"></path></svg>
          Sign in with Google (Soon)
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Not a member yet?{" "}
          <Button variant="link" asChild className="px-0 text-primary">
            <Link href="/auth/register">
              <UserPlus className="mr-2 h-4 w-4" /> Join the community
            </Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
