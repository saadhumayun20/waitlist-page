"use client";

import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarsBackground } from "./components/stars-background";
import Image from "next/image";

export default function WaitlistPage() {
  const [email, setEmail] = useState<string>(""); // TypeScript typing
  const [waitlistCount, setWaitlistCount] = useState<number>(1500);
  const [timeLeft, setTimeLeft] = useState({
    days: 50,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Update waitlist count
  useEffect(() => {
    const baseIncrement = 200 / (24 * 60 * 60);

    const updateCount = () => {
      setWaitlistCount((prev) => {
        if (Math.random() < 0.05) {
          return prev + Math.floor(Math.random() * 10) + 1;
        }
        if (Math.random() < 0.1) {
          return prev;
        }
        const increment = baseIncrement * (0.5 + Math.random());
        return Math.floor(prev + increment);
      });
    };

    const interval = setInterval(updateCount, 1000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newSeconds = prev.seconds - 1;
        if (newSeconds >= 0) return { ...prev, seconds: newSeconds };

        const newMinutes = prev.minutes - 1;
        if (newMinutes >= 0) return { ...prev, minutes: 59, seconds: 59 };

        const newHours = prev.hours - 1;
        if (newHours >= 0) return { ...prev, hours: newHours, minutes: 59, seconds: 59 };

        const newDays = prev.days - 1;
        if (newDays >= 0) return { days: newDays, hours: 23, minutes: 59, seconds: 59 };

        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
  
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      // Handle HTML error responses
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Unexpected response: ${text.slice(0, 100)}`);
      }
  
      if (!response.ok) {
        const errorData = await response.json();
  
        // Handle duplicate email case (409 Conflict)
        if (response.status === 409) {
          throw new Error(errorData.message || "This email is already signed up");
        }
  
        throw new Error(errorData.message || "Failed to sign up");
      }
  
      const data = await response.json();
      setSuccessMessage(data.message);
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#070314] bg-gradient-to-br from-[#070314] via-purple-950/20 to-[#070314] relative overflow-hidden">
      <StarsBackground />

      <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen text-center">
        {/* Logo */}
        {/* <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center mb-8"> */}
        <Image
          src="/logo.png"
          width="200"
          height="200"
          alt="logo"
          >
          </Image>
        {/* </div> */}
        {/* <div className="rounded-lg flex items-center justify-center "> */}
        
        {/* </div> */}

        {/* Waitlist counter */}
        <div className="bg-white/5 backdrop-blur-md rounded-full px-6 py-2 mb-12 inline-flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-purple-500" />
            <div className="w-6 h-6 rounded-full bg-purple-400" />
            <div className="w-6 h-6 rounded-full bg-purple-300" />
          </div>
          <span className="text-gray-300">
            Join {Math.floor(waitlistCount).toLocaleString()}+ others on the waitlist
          </span>
        </div>

        {/* Main content */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Join Our Waitlist Now!</h1>

        <p className="text-gray-400 max-w-2xl mb-12 text-lg">
          Sign up to gain early access features and updates!
        </p>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="w-full max-w-lg mb-6">
          <div className="flex gap-4 flex-col sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white px-8">
              {loading ? "Joining..." : "Join Waitlist"}
            </Button>
          </div>
          {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </form>

        {/* No spam message */}
        <div className="flex items-center gap-2 text-gray-400 mb-16">
          <Info className="w-4 h-4" />
          <span>No Spam, Only Genuine Updates</span>
        </div>

        {/* Countdown timer */}
        <div className="grid grid-cols-4 gap-6 text-center">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{value.toString().padStart(2, "0")}</div>
              <div className="text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
