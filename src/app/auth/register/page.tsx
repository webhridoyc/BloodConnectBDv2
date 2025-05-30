
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUserWithEmailAndPassword, updateProfile as firebaseUpdateProfile } from "firebase/auth";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, UserPlus, LogIn } from "lucide-react";

const RegisterFormSchema = z.object({
  name: z.string().min(3, { message: "Full name must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], 
});

type RegisterFormValues = z.infer<typeof RegisterFormSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading, updateUserProfile, signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/"); 
    }
  }, [user, authLoading, router]);

  async function onSubmit(data: RegisterFormValues) {
    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      if (firebaseUser) {
        await firebaseUpdateProfile(firebaseUser, {
          displayName: data.name,
        });
        await updateUserProfile({
          uid: firebaseUser.uid,
          name: data.name,
          email: firebaseUser.email,
          isDonor: false, 
        });
      }

      toast({
        title: "Registration Successful!",
        description: "Welcome to BloodLink BD. You can now explore the app.",
      });
      // router.push("/"); // useEffect will handle redirection
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email address is already in use. Please try another one or log in.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "The password is too weak. Please choose a stronger password.";
      }
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleSubmitting(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Signed up with Google!",
        description: "Welcome to BloodLink BD.",
      });
      // router.push("/"); // useEffect will handle redirection
    } catch (error: any) {
      console.error("Google Sign-Up error on Register Page:", error);
      toast({
        title: "Google Sign-Up Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  if (authLoading && !user) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (user) { 
      return null; 
  }

  return (
    <Card className="w-full shadow-xl animate-fade-in-up">
      <CardHeader className="text-center">
        <UserPlus className="mx-auto h-10 w-10 text-primary mb-3" />
        <CardTitle className="text-2xl">Become a Valued Member</CardTitle>
        <CardDescription>
          Join the BloodLink BD community to save lives and find support when you need it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} disabled={isSubmitting || isGoogleSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., member@example.com" {...field} disabled={isSubmitting || isGoogleSubmitting} />
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
                    <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting || isGoogleSubmitting} />
                  </FormControl>
                  <FormDescription>Must be at least 8 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting || isGoogleSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting || isGoogleSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
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
          disabled={isSubmitting || isGoogleSubmitting} 
          onClick={handleGoogleSignUp}
        >
           {isGoogleSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 118.3 512 0 398.5 0 256S118.3 0 244 0c69.9 0 125.5 28.9 165.7 68.6L372.3 112.6C339.2 83.8 296.3 64 244 64c-95.6 0-173.5 78.3-173.5 174.7S148.4 413.4 244 413.4c52.8 0 95.3-22.1 126.8-53.1 26.7-26 42.9-62.1 47.9-99.9H244V261.8h244z"></path></svg>
          )}
          Sign up with Google
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Already a member?{" "}
          <Button variant="link" asChild className="px-0 text-primary">
            <Link href="/auth/login">
              <LogIn className="mr-2 h-4 w-4" /> Login to your account
            </Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
