"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Droplet, LogIn, LogOut, User, UserPlus, HeartHandshake, Building, Search, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/core/Logo";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavLink = ({ href, children, icon, className, onClick }: NavLinkProps) => (
  <Button variant="ghost" asChild className={cn("text-sm font-medium text-foreground hover:text-primary", className)}>
    <Link href={href} onClick={onClick}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Link>
  </Button>
);

export function Navbar() {
  const { user, userProfile, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          <NavLink href="/donors" icon={<Search size={16}/>}>Find Donors</NavLink>
          <NavLink href="/request-blood" icon={<HeartHandshake size={16}/>}>Request Blood</NavLink>
          <NavLink href="/hospitals" icon={<Building size={16}/>}>Hospitals</NavLink>
          {user && <NavLink href="/ai-matcher" icon={<Bot size={16}/>}>AI Matcher</NavLink>}
        </nav>
        <div className="flex items-center space-x-3">
          {loading ? (
            <div className="h-10 w-20 animate-pulse rounded-md bg-muted"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || undefined} alt={userProfile?.name || "User"} />
                    <AvatarFallback>{getInitials(userProfile?.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {!userProfile?.isDonor && (
                   <DropdownMenuItem asChild>
                     <Link href="/donate">
                       <Droplet className="mr-2 h-4 w-4" />
                       Become a Donor
                     </Link>
                   </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button variant="default" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/auth/register">
                  <UserPlus className="mr-2 h-4 w-4" /> Register
                </Link>
              </Button>
            </>
          )}
          {/* Mobile Menu Trigger - can be implemented with Sheet if needed */}
        </div>
      </div>
    </header>
  );
}
