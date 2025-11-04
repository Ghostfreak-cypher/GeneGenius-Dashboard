"use client";

import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900">
                <span className="text-sm font-bold text-white">GG</span>
              </div>
              <span className="text-lg font-semibold text-neutral-900">
                GeneGenius
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Analysis
              </a>
              <a
                href="#"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Datasets
              </a>
              <a
                href="#"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Reports
              </a>
              <div className="ml-4 h-8 w-8 rounded-full bg-neutral-900 flex items-center justify-center">
                <span className="text-xs font-medium text-white">AD</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
