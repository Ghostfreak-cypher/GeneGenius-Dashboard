"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Shield,
  ArrowLeft,
  LogOut,
  Loader2,
  Activity,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");

    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      setUserEmail(email || "user@genegenius.com");
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackToDashboard = () => {
    router.push("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f1419] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={handleBackToDashboard}
            className="bg-[#1a1f28] border-gray-800 hover:bg-[#22272f] text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="bg-red-500/10 border border-red-500/50 hover:bg-red-500/20 text-red-400"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="bg-[#1a1f28] border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-2xl">User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-6">
              <Avatar className="w-24 h-24 border-4 border-blue-500/20">
                <AvatarImage src="/avatars/user.png" alt="Profile" />
                <AvatarFallback className="bg-blue-500/20 text-blue-400 text-2xl">
                  {userEmail.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Welcome Back!
                </h2>
                <p className="text-gray-400">Manage your GeneGenius account</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-4 bg-[#0f1419] rounded-lg border border-gray-800">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Email Address</p>
                  <p className="text-white font-medium">{userEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#0f1419] rounded-lg border border-gray-800">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Account Status</p>
                  <p className="text-white font-medium">Active & Verified</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#0f1419] rounded-lg border border-gray-800">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Role</p>
                  <p className="text-white font-medium">Researcher</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#0f1419] rounded-lg border border-gray-800">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Last Activity</p>
                  <p className="text-white font-medium">Just now</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
