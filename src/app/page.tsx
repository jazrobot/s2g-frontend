"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";
import Logo from "@/components/logo";
import { PlugZap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeProvider } from "@/components/theme-provider";

interface Station {
  id: string;
  name: string;
  location: string;
  status: "active" | "inactive";
}

export default function HomePage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const response = await api.get<Station[]>("/stations");
        setStations(response.data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchStations();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen flex-col">
        <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </nav>

        <main className="flex-1">
          <div className="container mx-auto px-4 py-12">
            <div className="mb-12 text-center">
              <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Charging Stations
              </h1>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Find available charging stations for your electric vehicle
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {loading ? (
                Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="mt-2 h-4 w-1/4" />
                      </CardHeader>
                      <Separator />
                      <CardContent className="pt-4">
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))
              ) : stations.length > 0 ? (
                stations.map((station) => (
                  <Card
                    key={station.id}
                    className="overflow-hidden transition-all hover:shadow-md"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="line-clamp-1">
                          {station.name}
                        </CardTitle>
                        <PlugZap className="h-5 w-5 text-primary" />
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Location:</span>{" "}
                        {station.location}
                      </p>
                      <Badge
                        variant={
                          station.status === "active"
                            ? "default"
                            : "destructive"
                        }
                        className="mt-4 inline-flex w-auto"
                      >
                        {station.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <PlugZap className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-xl font-medium">No stations available</p>
                  <p className="text-sm text-muted-foreground">
                    Check back later for available charging stations
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
