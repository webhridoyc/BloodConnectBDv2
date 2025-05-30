
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, MapPin, Phone, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Donors | BloodLink BD",
  description: "Find registered blood donors in your area.",
};

// Mock donor data for demonstration purposes
// In a real application, this data would be fetched from a database (e.g., Firestore)
const mockDonors = [
  {
    uid: "donor1",
    name: "Abdullah Al Mamun",
    bloodGroup: "A+",
    location: "Dhaka",
    contactNumber: "017XX-XXX-XXX", // Partially masked for privacy
  },
  {
    uid: "donor2",
    name: "Fatima Begum",
    bloodGroup: "O-",
    location: "Chittagong",
    contactNumber: "018XX-XXX-XXX",
  },
  {
    uid: "donor3",
    name: "Rahim Sheikh",
    bloodGroup: "B+",
    location: "Sylhet",
    contactNumber: "019XX-XXX-XXX",
  },
  {
    uid: "donor4",
    name: "Ayesha Akhter",
    bloodGroup: "AB+",
    location: "Khulna",
    contactNumber: "016XX-XXX-XXX",
  },
  {
    uid: "donor5",
    name: "Kamal Hossain",
    bloodGroup: "O+",
    location: "Rajshahi",
    contactNumber: "015XX-XXX-XXX",
  },
  {
    uid: "donor6",
    name: "Sadia Islam",
    bloodGroup: "B-",
    location: "Barisal",
    contactNumber: "013XX-XXX-XXX",
  },
];

export default function DonorsPage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8 animate-fade-in-up">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Find a <span className="text-primary">Donor</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Browse our network of selfless individuals ready to save lives. 
          Filter by location and blood group to find a match.
        </p>
      </section>

      {/* Placeholder for future filter section */}
      {/* 
      <section className="animate-fade-in-up-delayed-1">
        <Card className="p-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Filter Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Filter options will be available here soon.</p>
            // Example: Select for blood group, Input for location
          </CardContent>
        </Card>
      </section> 
      */}

      <section className="animate-fade-in-up-delayed-2">
        {mockDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDonors.map((donor, index) => (
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
                    <span className="font-semibold text-foreground">{donor.contactNumber}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Request Contact
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No Donors Found</h2>
            <p className="text-muted-foreground">
              There are currently no registered donors matching your criteria or available in the system.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Please check back later, or if you are eligible, consider becoming a donor.
            </p>
            <Button asChild className="mt-6">
              <a href="/donate">Become a Donor</a>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
