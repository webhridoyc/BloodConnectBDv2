
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Corrected import
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Loader2, AlertTriangle, Droplet } from "lucide-react";
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
import Link from "next/link";

// Metadata might be moved or handled by generateMetadata if this page structure changes
// export const metadata: Metadata = {
//   title: "User Profile | BloodLink BD",
//   description: "Manage your BloodLink BD user profile.",
// };

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const ProfileFormSchema = z.object({
  name: z.string().min(3, { message: "Full name must be at least 3 characters." }).or(z.literal("").transform(() => null)), // Transform empty string to null if desired for DB
  location: z.string().min(3, { message: "Location must be at least 3 characters." }).optional().or(z.literal("").transform(() => undefined)),
  contactNumber: z.string()
    .min(10, { message: "Contact number must be at least 10 digits." })
    .regex(/^[0-9+-]+$/, { message: "Please enter a valid contact number." })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  bloodGroup: z.enum(bloodGroups).optional(),
});

type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: "",
      location: "",
      contactNumber: "",
      bloodGroup: undefined,
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || "",
        location: userProfile.location || "",
        contactNumber: userProfile.contactNumber || "",
        bloodGroup: userProfile.isDonor 
          ? (userProfile.bloodGroup as typeof bloodGroups[number] | undefined) 
          : undefined,
      });
    } else if (user && !authLoading) { // User loaded but profile might still be fetching or is null
      form.reset({
        name: user.displayName || "",
        location: "",
        contactNumber: "",
        bloodGroup: undefined,
      });
    }
  }, [user, userProfile, form, authLoading]);

  async function onSubmit(data: ProfileFormValues) {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const profileUpdateData: Partial<UserProfile> = {
        name: data.name === "" ? null : data.name, // Handle empty string submission for name
        location: data.location || undefined,
        contactNumber: data.contactNumber || undefined,
      };
      if (userProfile?.isDonor && data.bloodGroup) {
        profileUpdateData.bloodGroup = data.bloodGroup;
      }
      
      await updateUserProfile(profileUpdateData);
      toast({
        title: "Profile Updated!",
        description: "Your profile information has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-8">
        <section className="text-center py-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Access Denied
          </h1>
          <p className="mt-4 max-w-md mx-auto text-lg text-muted-foreground">
            You need to be logged in to view your profile.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

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
            <CardTitle>Edit Your Profile</CardTitle>
            <CardDescription>
              Keep your information up-to-date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" value={user.email || ""} readOnly disabled className="bg-muted/50" />
                  </FormControl>
                  <FormDescription>Your email address cannot be changed.</FormDescription>
                </FormItem>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Current Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dhanmondi, Dhaka" {...field} value={field.value ?? ""} />
                      </FormControl>
                       <FormDescription>Area/City where you are currently located.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 017XX-XXXXXX" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormDescription>This will be used for donation/request communication.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {userProfile?.isDonor && (
                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Group (Donor)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined} defaultValue={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your blood group" />
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
                        <FormDescription>Update your registered blood group.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Profile
                </Button>
              </form>
            </Form>
          </CardContent>
          {!userProfile?.isDonor && (
            <CardFooter className="flex-col items-start gap-2 pt-4">
               <p className="text-sm text-muted-foreground">Want to become a life-saver?</p>
                <Button variant="outline" asChild>
                    <Link href="/donate">
                        <Droplet className="mr-2 h-4 w-4" /> Register as a Donor
                    </Link>
                </Button>
            </CardFooter>
          )}
        </Card>
      </section>
    </div>
  );
}
