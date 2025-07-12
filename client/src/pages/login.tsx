import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequestJson } from "@/lib/queryClient";
import { loginUserSchema, type LoginUser } from "@shared/schema";
import { GraduationCap, BookOpen, Users } from "lucide-react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LoginUser>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginUser) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      // Store JWT token in localStorage
      localStorage.setItem("token", data.token);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.firstName}!`,
      });

      // Force a page reload to ensure proper authentication state
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginUser) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left side - Branding */}
        <div className="flex flex-col space-y-6 md:space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DRMS
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300">
              Department Resource Management System
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
            <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 dark:text-white">Resource Library</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Access academic materials</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="text-left">
                <h3 className="font-semibold text-slate-900 dark:text-white">Equipment Booking</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Reserve department equipment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your DRMS account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...form.register("email")}
                    className="h-11"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...form.register("password")}
                    className="h-11"
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                {/* Test Credentials */}
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Test Credentials:
                  </p>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700 rounded">
                      <span className="font-medium">Admin:</span>
                      <button 
                        type="button"
                        onClick={() => {
                          form.setValue("email", "admin@university.edu");
                          form.setValue("password", "admin123");
                        }}
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        admin@university.edu / admin123
                      </button>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700 rounded">
                      <span className="font-medium">Student:</span>
                      <button 
                        type="button"
                        onClick={() => {
                          form.setValue("email", "student@university.edu");
                          form.setValue("password", "student123");
                        }}
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        student@university.edu / student123
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Don't have an account?{" "}
                    <Link href="/register">
                      <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                        Sign up
                      </span>
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}