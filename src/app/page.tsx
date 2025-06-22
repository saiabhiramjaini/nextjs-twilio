"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Toaster, toast } from 'sonner';

const phoneSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export default function Home() {
  const [verificationSid, setVerificationSid] = useState<string>("");
  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onPhoneSubmit(values: z.infer<typeof phoneSchema>) {
    try {
      setIsLoadingSend(true);
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: values.phone }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setVerificationSid(data.verificationSid);
        toast.success("OTP sent successfully to your phone");
      } else {
        toast.error(data.details || data.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoadingSend(false);
    }
  }

  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    try {
      setIsLoadingVerify(true);
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verificationSid,
          otp: values.otp,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.valid) {
        toast.success("Phone number verified successfully!");
        // Reset forms after successful verification
        phoneForm.reset();
        otpForm.reset();
        setVerificationSid("");
      } else {
        toast.error(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoadingVerify(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Phone Verification</h1>
          <p className="text-gray-500 mt-2">
            Enter your phone number and the OTP you receive
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Phone Number Form */}
          <div className="space-y-6">
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
                <FormField
                  control={phoneForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+1234567890" 
                          {...field} 
                          disabled={isLoadingSend}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoadingSend}
                >
                  {isLoadingSend ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            </Form>
          </div>

          {/* OTP Form */}
          <div className="space-y-6">
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter OTP</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123456" 
                          {...field} 
                          disabled={isLoadingVerify || !verificationSid}
                          maxLength={6}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoadingVerify || !verificationSid}
                >
                  {isLoadingVerify ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  );
}
