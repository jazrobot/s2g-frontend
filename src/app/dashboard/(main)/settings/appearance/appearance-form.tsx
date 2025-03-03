"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function AppearanceForm() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Initialize with undefined to avoid hydration mismatch
  const [themeValue, setThemeValue] = useState<string | undefined>(undefined);

  // Handle initial client-side setup
  useEffect(() => {
    setMounted(true);
    setThemeValue(theme);
  }, [theme]);

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <RadioGroup
      value={themeValue ?? "system"}
      onValueChange={setTheme}
      className="flex flex-col gap-4 pt-2 sm:flex-row sm:gap-6"
    >
      {/* Opción Light */}
      <label className="flex cursor-pointer flex-col items-center [&:has([data-state=checked])>div]:border-primary">
        <RadioGroupItem value="light" className="sr-only" />
        <div className="items-center rounded-md border-2 border-muted p-1 transition-colors hover:border-accent">
          <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
            <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
              <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
            </div>
          </div>
        </div>
        <span className="block p-2 text-center font-normal">Light</span>
      </label>

      {/* Opción Dark */}
      <label className="flex cursor-pointer flex-col items-center [&:has([data-state=checked])>div]:border-primary">
        <RadioGroupItem value="dark" className="sr-only" />
        <div className="items-center rounded-md border-2 border-muted p-1 transition-colors hover:border-accent">
          <div className="space-y-2 rounded-sm bg-slate-950 p-2">
            <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
              <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-slate-400" />
              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-slate-400" />
              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
            </div>
          </div>
        </div>
        <span className="block p-2 text-center font-normal">Dark</span>
      </label>

      {/* Opción System */}
      <label className="flex cursor-pointer flex-col items-center [&:has([data-state=checked])>div]:border-primary">
        <RadioGroupItem value="system" className="sr-only" />
        <div className="items-center rounded-md border-2 border-muted p-1 transition-colors hover:border-accent">
          <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
            <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
              <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-slate-400" />
              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-slate-400" />
              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
            </div>
          </div>
        </div>
        <span className="block p-2 text-center font-normal">System</span>
      </label>
    </RadioGroup>
  );
}
