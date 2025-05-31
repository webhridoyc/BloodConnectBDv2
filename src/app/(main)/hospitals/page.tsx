
import type { Metadata } from "next";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Hospitals & Blood Banks | BloodLink BD",
  description: "Find hospitals and blood banks near you.",
};

interface HospitalData {
  id: string;
  name: string;
  address: string;
  contact: string;
  imageUrl: string;
  aiHint: string;
}

const sampleHospitals: HospitalData[] = [
  {
    id: "h1",
    name: "Dhaka Medical College Hospital",
    address: "Dhaka University Campus, Dhaka 1000",
    contact: "+880 2 55165001",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "hospital building"
  },
  {
    id: "h2",
    name: "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
    address: "Shahbag, Dhaka 1000",
    contact: "+880 2 55165600",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "medical university"
  },
  {
    id: "h3",
    name: "Square Hospitals Ltd.",
    address: "18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka 1205",
    contact: "10616",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "modern hospital"
  },
  {
    id: "h4",
    name: "United Hospital Limited",
    address: "Plot 15, Road 71, Gulshan, Dhaka 1212",
    contact: "10666",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "private hospital"
  },
  {
    id: "h5",
    name: "Chittagong Medical College Hospital",
    address: "Chittagong Medical College Rd, Chattogram",
    contact: "+880 31 630722",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "regional hospital"
  },
  {
    id: "h6",
    name: "Quantum Foundation Blood Bank",
    address: "31/V Shilpacharya Zainul Abedin Sarak, (Old 119 Shantinagar), Dhaka-1217",
    contact: "+8801714047626",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "blood bank"
  }
];

export default function HospitalsPage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8 animate-fade-in-up">
        <Building className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Hospitals & <span className="text-primary">Blood Banks</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Find hospitals and blood banks near you for medical assistance and blood donation.
        </p>
      </section>

      <section className="animate-fade-in-up-delayed-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleHospitals.map((hospital, index) => (
            <Card 
              key={hospital.id} 
              className="shadow-lg hover:shadow-xl transition-all duration-300 ease-out flex flex-col hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="relative h-40 w-full mb-4 rounded-t-lg overflow-hidden">
                  <Image
                    src={hospital.imageUrl}
                    alt={hospital.name}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={hospital.aiHint}
                  />
                </div>
                <CardTitle className="text-xl text-foreground">{hospital.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 flex-grow">
                <div className="flex items-start text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{hospital.address}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>{hospital.contact}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Details (Soon)
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
