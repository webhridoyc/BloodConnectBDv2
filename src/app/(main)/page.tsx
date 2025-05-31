
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Droplet, Users, HeartHandshake, Search, Building, UserPlus, TrendingUp, ShieldCheck, Gift, BookOpen, LifeBuoy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-20">
      {/* Hero Section */}
      <section
        className="hero-section text-center py-12 md:py-20 rounded-xl shadow-lg relative overflow-hidden"
      >
        <div className="container mx-auto px-4 relative z-10">
          <Droplet className="mx-auto h-16 w-16 text-primary mb-6 animate-pulse animate-fade-in-up" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground animate-fade-in-up">
            Welcome to <span className="text-primary">BloodLink BD</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white animate-fade-in-up-delayed-1">
            Connecting hearts, saving lives. Find blood donors and request blood in Bangladesh with ease and efficiency.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up-delayed-2">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform hover:scale-105">
              <Link href="/request-blood">
                <HeartHandshake className="mr-2 h-5 w-5" /> Request Blood
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-md transition-transform hover:scale-105 border-primary text-primary hover:bg-primary/10">
              <Link href="/donate">
                <UserPlus className="mr-2 h-5 w-5" /> Become a Donor
              </Link>
            </Button>
          </div>
        </div>
        <style jsx>{`
          .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('https://i.ibb.co/BVRcJYYb/fotor-ai-20250528121737.jpg');
            background-size: cover;
            background-position: center;
            filter: blur(5px) brightness(0.7); /* Added brightness to darken slightly */
            z-index: 0;
          }
        `}</style>
      </section>

      {/* Impact Stats Section */}
      <section className="py-12">
        <h2 className="text-3xl font-semibold text-center mb-10 text-foreground animate-fade-in-up">
          Your Donation, <span className="text-primary">Their Lifeline</span>
        </h2>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up-delayed-1 p-6">
            <TrendingUp className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-4xl font-bold text-primary">1,000+</CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">Lives Touched Annually (Placeholder)</CardDescription>
          </Card>
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up-delayed-2 p-6">
            <Users className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-4xl font-bold text-primary">500+</CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">Active Donors Registered (Placeholder)</CardDescription>
          </Card>
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up-delayed-3 p-6">
            <HeartHandshake className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-xl font-bold text-primary">Every Pint Saves Lives</CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">One donation can help up to 3 people.</CardDescription>
          </Card>
        </div>
      </section>

      {/* New Section: Find a Lifesaver */}
      <section className="py-12 bg-card rounded-xl shadow-lg">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-semibold mb-4 text-foreground">
              Find a <span className="text-primary">Lifesaver</span> in Minutes
            </h2>
            <p className="text-muted-foreground mb-3 text-lg">
              Need blood urgently? We’re here to help. Use our smart donor-matching system to quickly connect with verified blood donors near you. Whether it’s for an emergency or scheduled transfusion, you’re just a few clicks away from saving a life.
            </p>
            <p className="text-muted-foreground mb-6 text-lg">
              Post a request or search now — help is closer than you think.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform hover:scale-105">
                <Link href="/request-blood">
                  <HeartHandshake className="mr-2 h-5 w-5" /> Post a Request
                </Link>
              </Button>
               <Button size="lg" variant="outline" asChild className="shadow-md transition-transform hover:scale-105">
                <Link href="/donors">
                  <Search className="mr-2 h-5 w-5" /> Search Donors
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-md animate-fade-in-up-delayed-1">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Hand holding a blood drop being passed to another hand" 
              layout="fill" 
              objectFit="cover"
              data-ai-hint="blood donation hands"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-10 text-foreground animate-fade-in-up">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in-up-delayed-1">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <UserPlus className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">1. Register</h3>
              <p className="text-muted-foreground">
                Sign up as a donor or create an account to request blood. It's quick and easy.
              </p>
            </div>
            <div className="text-center animate-fade-in-up-delayed-2">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Search className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">2. Find or Request</h3>
              <p className="text-muted-foreground">
                Search for available donors by blood group and location, or post a blood request.
              </p>
            </div>
            <div className="text-center animate-fade-in-up-delayed-3">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <HeartHandshake className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">3. Connect & Save</h3>
              <p className="text-muted-foreground">
                Connect with potential donors or requesters. Your contribution can save a life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-10 text-foreground animate-fade-in-up">
            The Gift of Life: <span className="text-primary">Why Donate?</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up-delayed-1">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl text-foreground">Are You Eligible?</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>Most healthy adults can donate blood. General guidelines include:</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>Age: 18-60 years</li>
                  <li>Weight: At least 50 kg (110 lbs)</li>
                  <li>Good general health</li>
                  <li>Not suffering from certain medical conditions</li>
                </ul>
                <p className="text-xs italic">Please consult a medical professional if you have specific health concerns before donating.</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up-delayed-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl text-foreground">Benefits of Donating</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>Your selfless act has profound impacts:</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>Saves up to three lives with a single donation.</li>
                  <li>Helps patients undergoing surgery, cancer treatment, or suffering from trauma.</li>
                  <li>Can provide a mini-health check-up for you.</li>
                  <li>Offers a great sense of contribution and community connection.</li>
                </ul>
                <div className="pt-4 text-center">
                   <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform hover:scale-105">
                     <Link href="/donate">
                       <UserPlus className="mr-2 h-5 w-5" /> Become a Donor Today
                     </Link>
                   </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Join Our Community Section (Existing, slight style adjustments may be needed) */}
      <section className="py-12 bg-card rounded-xl shadow-lg">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-semibold mb-4 text-foreground">Join Our <span className="text-primary">Life-Saving Network</span></h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Be a part of a compassionate community dedicated to making a difference. Every drop counts, and every donor is a hero. 
              Together, we can bring hope and healing across Bangladesh.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform hover:scale-105">
                <Link href="/auth/register">
                  Get Started Now
                </Link>
              </Button>
               <Button size="lg" variant="outline" asChild className="shadow-md transition-transform hover:scale-105">
                <Link href="/donors">
                  Find Available Donors
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-md animate-fade-in-up-delayed-1">
            <Image 
              src="https://i.ibb.co/MDSwLLVX/Generated-Image-May-28-2025-10-48-AM.jpg" 
              alt="Community of blood donors and medical professionals" 
              layout="fill" 
              objectFit="cover"
              data-ai-hint="community diverse people"
            />
          </div>
        </div>
      </section>

      {/* Stories of Hope Section (Placeholder) */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-foreground animate-fade-in-up">
            Stories of <span className="text-primary">Hope</span>
          </h2>
          <Card className="shadow-lg animate-fade-in-up-delayed-1">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-accent/30 rounded-full">
                     <BookOpen className="h-10 w-10 text-accent-foreground" />
                  </div>
              </div>
              <CardTitle>Coming Soon: Inspiring Journeys</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We will soon feature heartwarming stories from donors and recipients whose lives have been touched by the BloodLink BD community. These testimonials will highlight the real-world impact of your generosity and the importance of blood donation. Stay tuned!
              </p>
            </CardContent>
             <CardFooter className="justify-center">
                <Button variant="ghost" disabled className="text-primary">
                    Share Your Story (Feature Coming Soon)
                </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

       {/* Our Mission Section (Existing) */}
       <section className="text-center py-12 bg-muted/50 rounded-xl">
         <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-4 text-foreground animate-fade-in-up">Our Mission</h2>
           <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground animate-fade-in-up-delayed-1">
              To bridge the gap between blood donors and those in need, fostering a community of support and compassion throughout Bangladesh. We leverage technology to make blood donation and reception more accessible and efficient.
            </p>
          </div>
      </section>
    </div>
  );
}

    
