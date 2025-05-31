
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, User, MapPin, Phone, AlertTriangle, CalendarClock, Droplet, Building, HelpCircle } from "lucide-react";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { BloodRequest } from "@/lib/types";
import { LoadingSpinner } from "@/components/core/LoadingSpinner";
import { formatDistanceToNowStrict } from 'date-fns';
import { cn } from "@/lib/utils";

interface RequestDisplayData extends Omit<BloodRequest, 'createdAt'> {
  id: string;
  createdAt: string; 
  relativeTime: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const requestsRef = collection(db, "bloodRequests");
        const q = query(requestsRef, where("status", "==", "open"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedRequests: RequestDisplayData[] = [];
        querySnapshot.forEach((doc) => {
          const requestData = doc.data() as Omit<BloodRequest, 'id' | 'createdAt'> & { createdAt: Timestamp };
          if (doc.id && requestData && requestData.createdAt) {
            fetchedRequests.push({
              ...requestData,
              id: doc.id,
              createdAt: requestData.createdAt.toDate().toLocaleDateString(),
              relativeTime: formatDistanceToNowStrict(requestData.createdAt.toDate(), { addSuffix: true }),
            });
          } else {
            console.warn("Skipping request document due to missing data, ID, or createdAt field:", doc.id, requestData);
          }
        });
        setRequests(fetchedRequests);
      } catch (err: any) {
        console.error("Error fetching blood requests:", err);
        if (err.code === 'permission-denied') {
          setError("ডাটাবেস থেকে রক্তের অনুরোধগুলো আনার অনুমতি নেই। অনুগ্রহ করে আপনার লগইন স্ট্যাটাস পরীক্ষা করুন অথবা অ্যাডমিনের সাথে যোগাযোগ করুন।");
        } else if (err.code === 'failed-precondition' && err.message.includes('The query requires an index')) {
          setError("ডাটাবেসের একটি সূচক (index) প্রয়োজন যা এখনও তৈরি হয়নি। অনুগ্রহ করে Firebase Console-এ গিয়ে Firestore-এর জন্য প্রয়োজনীয় কম্পোজিট ইনডেক্স তৈরি করুন। Firestore error message: " + err.message);
        }
        else {
          setError("রক্তের অনুরোধগুলো লোড করা যায়নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getUrgencyColor = (urgency: "low" | "medium" | "high") => {
    switch (urgency) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500"; // Corrected from orange to yellow for better standard theme compatibility
      case "low":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <LoadingSpinner size={48} />
          <p className="text-muted-foreground">অনুরোধগুলো লোড হচ্ছে...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16 text-destructive">
          <AlertTriangle className="mx-auto h-16 w-16 mb-6" />
          <h2 className="text-2xl font-semibold mb-2">ত্রুটি</h2>
          <p className="whitespace-pre-wrap">{error}</p>
        </div>
      );
    }

    if (requests.length === 0) {
      return (
        <div className="text-center py-16">
          <HelpCircle className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">কোনো সক্রিয় অনুরোধ নেই</h2>
          <p className="text-muted-foreground">
            এই মুহূর্তে সিস্টেমে কোনো সক্রিয় রক্তের অনুরোধ পাওয়া যায়নি।
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request, index) => (
          <Card
            key={request.id}
            className="shadow-lg hover:shadow-xl transition-all duration-300 ease-out flex flex-col hover:scale-105 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">{request.patientName}</CardTitle>
              <CardDescription>
                <span className={cn("font-semibold", getUrgencyColor(request.urgency))}>
                  জরুরি অবস্থা: {request.urgency.toUpperCase()}
                </span>
                 {' · '} <span className="text-xs text-muted-foreground">{request.relativeTime} ({request.createdAt})</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow">
               <div className="flex items-center text-muted-foreground">
                <User className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                <span>অনুরোধ করেছেন: <span className="font-semibold text-foreground">{request.requesterName}</span></span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Droplet className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                <span>রক্তের গ্রুপ: <span className="font-semibold text-foreground">{request.bloodGroup}</span></span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                <span>অবস্থান: <span className="font-semibold text-foreground">{request.location}</span></span>
              </div>
              {request.hospitalName && (
                <div className="flex items-center text-muted-foreground">
                  <Building className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                  <span>হাসপাতাল: <span className="font-semibold text-foreground">{request.hospitalName}</span></span>
                </div>
              )}
              <div className="flex items-center text-muted-foreground">
                <Phone className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-semibold text-foreground">{request.contactInfo}</span>
              </div>
              {request.notes && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground italic">"{request.notes}"</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled>
                সাহায্য করতে চান (শীঘ্রই আসছে)
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
        <ClipboardList className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          রক্তের <span className="text-primary">অনুরোধ</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          বর্তমান রক্তের অনুরোধগুলো দেখুন এবং সাহায্য করার সুযোগ খুঁজুন।
        </p>
      </section>
      <section className="animate-fade-in-up-delayed-1">
        {renderContent()}
      </section>
    </div>
  );
}
