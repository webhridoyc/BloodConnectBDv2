
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, MapPin, Phone, Users, AlertTriangle } from "lucide-react";
// Metadata import removed as it's a client component
// import type { Metadata } from "next"; 
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { UserProfile } from "@/lib/types"; 
import { LoadingSpinner } from "@/components/core/LoadingSpinner";

interface DonorDisplayData {
  uid: string; // This will now be doc.id
  name: string;
  bloodGroup: string;
  location: string;
  contactNumber: string;
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
          // Also ensure userData itself exists, and that doc.id is available
          if (doc.id && userData && userData.name && userData.bloodGroup && userData.location && userData.contactNumber) {
            fetchedDonors.push({
              uid: doc.id, // Use doc.id as the unique key source
              name: userData.name,
              bloodGroup: userData.bloodGroup,
              location: userData.location,
              contactNumber: userData.contactNumber, 
            });
          } else {
            console.warn("Skipping donor document due to missing data or ID:", doc.id, userData);
          }
        });
        setDonors(fetchedDonors);
      } catch (err: any) { // Catch block updated
        console.error("Error fetching donors:", err);
        if (err.code === 'permission-denied') {
          setError("ডাটাবেস থেকে তথ্য আনার অনুমতি নেই। অনুগ্রহ করে আপনার লগইন স্ট্যাটাস পরীক্ষা করুন অথবা অ্যাডমিনের সাথে যোগাযোগ করুন।");
        } else {
          setError("ডোনারদের তথ্য লোড করা যায়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।");
        }
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
          <p className="text-muted-foreground">ডোনারদের তথ্য লোড হচ্ছে...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16 text-destructive">
          <AlertTriangle className="mx-auto h-16 w-16 mb-6" />
          <h2 className="text-2xl font-semibold mb-2">ত্রুটি</h2>
          <p>{error}</p>
        </div>
      );
    }

    if (donors.length === 0) {
      return (
        <div className="text-center py-16">
          <Users className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">কোনো ডোনার পাওয়া যায়নি</h2>
          <p className="text-muted-foreground">
            বর্তমানে সিস্টেমে কোনো রেজিস্টার্ড ডোনার নেই।
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            অনুগ্রহ করে কিছুক্ষণ পর আবার দেখুন, অথবা আপনি যদি রক্তদানে সক্ষম হন, তাহলে ডোনার হিসেবে রেজিস্টার করুন।
          </p>
          <Button asChild className="mt-6">
            <a href="/donate">ডোনার হোন</a>
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
                <span>রক্তের গ্রুপ: <span className="font-semibold text-foreground">{donor.bloodGroup}</span></span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                <span>অবস্থান: <span className="font-semibold text-foreground">{donor.location}</span></span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Phone className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-semibold text-foreground">{donor.contactNumber}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                যোগাযোগের জন্য অনুরোধ (শীঘ্রই আসছে)
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
          খুঁজুন <span className="text-primary">ডোনার</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          আমাদের জীবন রক্ষাকারী স্বেচ্ছাসেবকদের নেটওয়ার্কে ব্রাউজ করুন।
        </p>
      </section>
      <section className="animate-fade-in-up-delayed-1">
        {renderContent()}
      </section>
    </div>
  );
}

