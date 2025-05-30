
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, MapPin, Phone, Users, AlertTriangle, Loader2 } from "lucide-react";
import type { Metadata } from "next"; // Keep for potential generateMetadata if needed
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { UserProfile } from "@/lib/types"; // Using UserProfile as source for donor data
import { LoadingSpinner } from "@/components/core/LoadingSpinner";

// Metadata might be handled by a Server Component parent or generateMetadata
// export const metadata: Metadata = {
//   title: "Find Donors | BloodLink BD",
//   description: "Find registered blood donors in your area.",
// };

interface DonorDisplayData {
  uid: string;
  name: string;
  bloodGroup: string;
  location: string;
  contactNumber: string;
  // registrationTime?: string; // Optional: formatted string for display
}

export default function DonorsPage() {
  const [donors, setDonors] = useState<DonorDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("isDonor", "==", true));
        const querySnapshot = await getDocs(q);
        const fetchedDonors: DonorDisplayData[] = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data() as UserProfile;
          // Ensure essential donor fields are present
          if (userData.name && userData.bloodGroup && userData.location && userData.contactNumber) {
            fetchedDonors.push({
              uid: userData.uid,
              name: userData.name,
              bloodGroup: userData.bloodGroup,
              location: userData.location,
              // In a real app, you might want to further format or control visibility of contactNumber
              contactNumber: userData.contactNumber, 
            });
          }
        });
        setDonors(fetchedDonors);
      } catch (err) {
        console.error("Error fetching donors:", err);
        setError("Failed to load donor information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonors();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <LoadingSpinner size={48} />
          <p className="text-muted-foreground">Loading donors...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16 text-destructive">
          <AlertTriangle className="mx-auto h-16 w-16 mb-6" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Donors</h2>
          <p>{error}</p>
        </div>
      );
    }

    if (donors.length === 0) {
      return (
        <div className="text-center py-16">
          <Users className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Donors Found</h2>
          <p className="text-muted-foreground">
            There are currently no registered donors available in the system.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Please check back later, or if you are eligible, consider becoming a donor.
          </p>
          <Button asChild className="mt-6">
            <a href="/donate">Become a Donor</a>
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donors.map((donor, index) => (
          <Card 
            key={donor.uid} 
            className="shadow-lg hover:shadow-xl transition-all duration-300 ease-out flex flex-col hover:scale-105 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">{donor.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow">
              <div className="flex items-center text-muted-foreground">
                <Droplet className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                <span>Blood Group: <span className="font-semibold text-foreground">{donor.bloodGroup}</span></span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                <span>Location: <span className="font-semibold text-foreground">{donor.location}</span></span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Phone className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                {/* Displaying contact number - consider privacy implications for a real app */}
                <span className="font-semibold text-foreground">{donor.contactNumber}</span>
              </div>
            </CardContent>
            <CardFooter>
              {/* TODO: Implement actual contact request logic if needed */}
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Request Contact (Soon)
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <section className="text-center py-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Find a <span className="text-primary">Donor</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Browse our network of selfless individuals ready to save lives. 
        </p>
      </section>

      {/* Placeholder for future filter section (can be added back later) */}
      {/* 
      <section className="animate-fade-in-up-delayed-1">
        <Card className="p-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Filter Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Filter options (e.g., by location, blood group) will be available here soon.</p>
          </CardContent>
        </Card>
      </section> 
      */}

      <section className="animate-fade-in-up-delayed-1">
        {renderContent()}
      </section>
    </div>
  );
}
