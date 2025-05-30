
import { Logo } from "@/components/core/Logo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <div className="mb-8">
        <Logo iconSize={32} textSize="text-3xl" />
      </div>
      <main className="w-full max-w-md">
        {children}
      </main>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} BloodLink BD. Connecting hearts, saving lives.
      </footer>
    </div>
  );
}
