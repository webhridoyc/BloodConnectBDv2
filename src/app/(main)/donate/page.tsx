
"use client";

import type { Metadata } from "next"; // Keep for potential future use if page becomes server component
import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Droplet, Loader2, UserCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";

// Metadata might be moved to a Server Component parent or a generateMetadata function if needed
// export const metadata: Metadata = {
//   title: "Become a Donor | BloodLink BD",
//   description: "Register as a blood donor and save lives.",
// };

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const DonorRegistrationFormSchema = z.object({
  name: z.string().min(3, { message: "Full name must be at least 3 characters." }),
  bloodGroup: z.enum(bloodGroups, { required_error: "Blood group is required." }),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }),
  contactNumber: z
    .string()
    .min(10, { message: "Contact number must be at least 10 digits." })
    .regex(/^[0-9+-]+$/, { message: "Please enter a valid contact number." }),
});

type DonorRegistrationFormValues = z.infer<typeof DonorRegistrationFormSchema>;

export default function DonatePage() {
  const { user, userProfile, loading, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DonorRegistrationFormValues>({
    resolver: zodResolver(DonorRegistrationFormSchema),
    defaultValues: {
      name: "",
      bloodGroup: undefined,
      location: "",
      contactNumber: "",
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || "",
        bloodGroup: userProfile.bloodGroup as typeof bloodGroups[number] | undefined || undefined,
        location: userProfile.location || "",
        contactNumber: userProfile.contactNumber || "",
      });
    }
  }, [userProfile, form]);

  async function onSubmit(data: DonorRegistrationFormValues) {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to register as a donor.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUserProfile({
        ...data, // name, bloodGroup, location, contactNumber
        isDonor: true,
        // donorRegistrationTime will be handled by updateUserProfile in AuthContext
      });
      toast({
        title: "Registration Successful!",
        description: "Thank you for becoming a blood donor.",
      });
      // No need to form.reset() here as the component will re-render to show "Already a donor"
    } catch (error) {
      console.error("Error registering donor:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner size={32} />
        </div>
      );
    }

    if (!user) {
      return (
        <Card className="max-w-lg mx-auto shadow-lg text-center">
          <CardHeader>
            <CardTitle>Become a Donor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AlertTriangle className="mx-auto h-12 w-12 text-primary mb-4" />
            <p className="text-muted-foreground">
              You need to be logged in to register as a blood donor.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (userProfile?.isDonor) {
      return (
        <Card className="max-w-lg mx-auto shadow-lg text-center">
          <CardHeader>
            <UserCheck className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <CardTitle>You are a Registered Donor!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Thank you for your commitment to saving lives. Your donor information:
            </p>
            <ul className="mt-4 text-left space-y-2 text-sm">
              <li><strong>Name:</strong> {userProfile.name || 'N/A'}</li>
              <li><strong>Email:</strong> {user.email || 'N/A'}</li>
              <li><strong>Blood Group:</strong> {userProfile.bloodGroup || 'N/A'}</li>
              <li><strong>Location:</strong> {userProfile.location || 'N/A'}</li>
              <li><strong>Contact:</strong> {userProfile.contactNumber || 'N/A'}</li>
            </ul>
            <Button asChild className="mt-6">
              <Link href="/profile">Update Profile</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Donor Registration Form</CardTitle>
          <CardDescription>
            Please provide your accurate details. This information will be used to connect you with those in need of blood.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" value={user.email || ""} readOnly disabled className="bg-muted/50" />
                </FormControl>
                <FormDescription>Your email address (cannot be changed here).</FormDescription>
              </FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bloodGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Current Location (Area/City)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dhanmondi, Dhaka" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 017XX-XXXXXX" {...field} />
                    </FormControl>
                    <FormDescription>
                      This number will be shared with blood requesters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register as Donor
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <section className="text-center py-8 animate-fade-in-up">
        <Droplet className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Become a <span className="text-primary">Donor</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Join our community of life-savers by registering your details.
        </p>
      </section>

      <section className="animate-fade-in-up-delayed-1">
        {renderContent()}
      </section>
    </div>
  );
}
