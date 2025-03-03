"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import api from "@/lib/axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useStationStatus } from "@/hooks/useStationStatus";

const chartConfig = {
  views: {
    label: "Stations",
  },
  active: {
    label: "Active",
    color: "hsl(var(--chart-1))",
  },
  inactive: {
    label: "Inactive",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface BreakdownData {
  location: string;
  active: number;
  inactive: number;
}

export default function Component() {
  // useStationStatus retorna un objeto { active, inactive } (totales)
  const { data: chartData, loading } = useStationStatus();
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("active");

  // Data agregada (totales generales)
  // Si chartData es null, se usan ceros
  const total = {
    active: chartData?.active ?? 0,
    inactive: chartData?.inactive ?? 0,
  };

  // Estado para almacenar la data detallada por ubicacion
  const [breakdownData, setBreakdownData] = React.useState<BreakdownData[]>([]);
  const [breakdownLoading, setBreakdownLoading] =
    React.useState<boolean>(false);

  // Al hacer click sobre active/inactive, se obtiene la data desglosada por ubicacion.
  React.useEffect(() => {
    async function fetchBreakdown() {
      setBreakdownLoading(true);
      try {
        const response = await api.get<
          {
            location: string;
            total_stations: number;
            active_stations: number;
            avg_capacity: number;
          }[]
        >("/analytics/stations/location-stats");
        // Transformamos la respuesta para incluir "inactive" como:
        // inactive = total_stations - active_stations
        const detailed = response.data.map((item) => ({
          location: item.location,
          active: item.active_stations,
          inactive: item.total_stations - item.active_stations,
        }));
        setBreakdownData(detailed);
      } catch (err) {
        console.error("Error fetching breakdown data:", err);
        setBreakdownData([]);
      } finally {
        setBreakdownLoading(false);
      }
    }
    // Cada vez que cambia el estado seleccionado, refrescamos la data
    void fetchBreakdown();
  }, [activeChart]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Station Status by Location</CardTitle>
            <CardDescription>Loading totals...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex h-[250px] items-center justify-center">
            <p>Loading station data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Station Status by Location</CardTitle>
          <CardDescription>
            {breakdownLoading
              ? "Loading breakdown..."
              : `Showing ${activeChart} stations by location`}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 border-l px-4 sm:border-t-0">
          {(["active", "inactive"] as Array<keyof typeof chartConfig>).map(
            (key) => (
              <button
                key={key}
                onClick={() => setActiveChart(key)}
                className={`flex flex-col items-center rounded-md px-3 py-2 ${activeChart === key ? "bg-muted" : "hover:bg-muted/50"}`}
                data-active={activeChart === key}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[key].label}
                </span>
                <span className="text-xl font-bold">
                  {total[key].toLocaleString()}
                </span>
              </button>
            ),
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {breakdownLoading ? (
          <div className="flex h-[250px] items-center justify-center">
            <p>Loading breakdown data...</p>
          </div>
        ) : breakdownData.length > 0 ? (
          <ChartContainer
            className="aspect-auto h-[250px] w-full"
            config={chartConfig}
          >
            <BarChart
              data={breakdownData.filter((item) =>
                activeChart === "active" ? item.active > 0 : item.inactive > 0,
              )}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="location"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const data = payload[0].payload;
                    return (
                      <ChartTooltipContent>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium">{data.location}</p>
                          <p className="text-xs text-muted-foreground">
                            {activeChart === "active" ? "Active" : "Inactive"}:{" "}
                            {data[activeChart]}
                          </p>
                        </div>
                      </ChartTooltipContent>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey={activeChart}
                fill={chartConfig[activeChart].color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center">
            <p>No data available for {activeChart} stations</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
