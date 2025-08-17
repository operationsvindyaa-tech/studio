"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // In a real application, you would handle authentication here.
      // For now, we'll just redirect to the progress report page.
      router.push("/progress-report");
    }, 1500);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary p-3 rounded-full w-fit mb-4">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl">Student Portal Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your dashboard.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="student@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Login"}
          </Button>
          <Button variant="link" size="sm" className="text-muted-foreground">
            Forgot your password?
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
