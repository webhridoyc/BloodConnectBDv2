
"use client";

import type { Metadata } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HeartHandshake, Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";

export const metadata: Metadata = {
  title: "Request Blood | BloodLink BD",
  description: "Submit a blood request to find donors in Bangladesh.",
};

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
const urgencyLevels = ["low", "medium", "high"] as const;

const BloodRequestFormSchema = z.object({
  patientName: z.string().min(3, { message: "Patient name must be at least 3 characters." }),
  requesterName: z.string().min(3, { message: "Requester name must be at least 3 characters." }),
  bloodGroup: z.enum(bloodGroups, { required_error: "Blood group is required." }),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }),
  hospitalName: z.string().optional(),
  contactInfo: z.string().min(5, { message: "Valid contact information is required." }),
  urgency: z.enum(urgencyLevels, { required_error: "Urgency level is required." }),
  notes: z.string().max(500, { message: "Notes cannot exceed 500 characters." }).optional(),
});

type BloodRequestFormValues = z.infer<typeof BloodRequestFormSchema>;

export default function RequestBloodPage() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BloodRequestFormValues>({
    resolver: zodResolver(BloodRequestFormSchema),
    defaultValues: {
      patientName: "",
      requesterName: "",
      bloodGroup: undefined,
      location: "",
      hospitalName: "",
      contactInfo: "",
      urgency: undefined,
      notes: "",
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        ...form.getValues(),
        requesterName: userProfile.name || "",
        contactInfo: userProfile.contactNumber || form.getValues().contactInfo || "",
        location: userProfile.location || form.getValues().location || "",
      });
    }
  }, [userProfile, form]);

  async function onSubmit(data: BloodRequestFormValues) {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit a blood request.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "bloodRequests"), {
        ...data,
        hospitalName: data.hospitalName || null,
        notes: data.notes || null,
        requesterUid: user.uid,
        createdAt: serverTimestamp(),
        status: "open" as const,
      });
      toast({
        title: "Request Submitted",
        description: "Your blood request has been successfully submitted.",
      });
      form.reset({ // Reset to default or prefilled values
        patientName: "",
        requesterName: userProfile?.name || "",
        bloodGroup: undefined,
        location: userProfile?.location || "",
        hospitalName: "",
        contactInfo: userProfile?.contactNumber || "",
        urgency: undefined,
        notes: "",
      });
    } catch (error) {
      console.error("Error submitting blood request:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-8 animate-fade-in-up">
        <HeartHandshake className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Request <span className="text-primary">Blood</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Fill out the form below to submit a blood request to our network of donors.
        </p>
      </section>

      <section className="animate-fade-in-up-delayed-1">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Blood Request Form</CardTitle>
            <CardDescription>
              Please provide accurate details to help us find a suitable donor quickly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient&apos;s Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requesterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Full Name (Requester)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jane Smith" {...field} />
                      </FormControl>
                       <FormDescription>
                        This is your name, as the person making the request.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Blood Group</FormLabel>
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
                    name="urgency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Urgency Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select urgency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {urgencyLevels.map((level) => (
                              <SelectItem key={level} value={level} className="capitalize">
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Area/City)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dhanmondi, Dhaka" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hospitalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dhaka Medical College Hospital" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Contact Information</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 017XX-XXXXXX or email@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        A phone number or email where donors can reach you.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any other relevant information, e.g., patient condition, specific timing needs (max 500 characters)."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Request
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

