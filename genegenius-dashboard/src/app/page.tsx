"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GenomicsMonitoringChart } from "@/components/dashboard/GenomicsMonitoringChart";
import { CancerSummaryChart } from "@/components/dashboard/CancerSummaryChart";
import { GenotypeFrequencyChart } from "@/components/dashboard/GenotypeFrequencyChart";
import { ExpressionPlotChart } from "@/components/dashboard/ExpressionPlotChart";
import { DarkDashboardLayout } from "@/components/dashboard/DarkDashboardLayout";
import { Button } from "@/components/ui/button";
import { LogIn, Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");

    if (!token) {
      // Show login prompt for 2 seconds before redirecting
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      setIsLoading(false);
    } else {
      setIsAuthenticated(true);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileRedirect = () => {
    router.push("/profile");
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-[#1a1f28] border border-gray-800 rounded-2xl p-8 text-center shadow-xl">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="h-8 w-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Authentication Required
              </h2>
              <p className="text-gray-400">
                Please log in to access the GeneGenius Dashboard
              </p>
            </div>
            <Button
              onClick={handleLoginRedirect}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-all duration-200 hover:scale-105"
            >
              Go to Login
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              Redirecting automatically in 2 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated - show dashboard
  return (
    <DarkDashboardLayout>
      <div className="p-6 relative">

        {/* Bento Grid Layout */}
        <div
          className="
            grid
            gap-6
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            auto-rows-[minmax(200px,auto)]
            max-w-9xl
            mx-auto
          "
        >
          {/* Large Genomics Monitoring - occupies 2 rows */}
          <div className="sm:col-span-2 xl:col-span-2 xl:row-span-1 rounded-2xl shadow-md bg-[#0f111a] border border-neutral-800 p-4">
            <GenomicsMonitoringChart />
          </div>

          {/* Cancer Summary - tall narrow card */}
          <div className="rounded-2xl shadow-md bg-[#0f111a] border border-neutral-800 p-4">
            <CancerSummaryChart />
          </div>

          {/* Expression Plot - wide compact bar chart */}

          <div className="sm:col-span-2 xl:col-span-1 rounded-2xl shadow-md bg-[#0f111a] border border-neutral-800 p-4">
            <ExpressionPlotChart />
          </div>

          {/* Genotype Frequency - medium height */}
          <div className="sm:col-span-2 xl:col-span-2 xl:row-span-1 rounded-2xl shadow-md bg-[#0f111a] border border-neutral-800 p-4">
            <GenotypeFrequencyChart />
          </div>
        </div>
      </div>
    </DarkDashboardLayout>
  );
}
