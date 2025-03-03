"use client";

import { useState } from "react";
import { useStations } from "@/hooks/use-stations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StationFormData {
  name: string;
  location: string;
  max_capacity_kw: number;
}

export default function StationsPage() {
  const {
    stations,
    loading,
    error,
    createStation,
    updateStationStatus,
    filters,
    setFilters,
  } = useStations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<StationFormData>();

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value === "all" ? undefined : value });
  };

  const handleLocationChange = (value: string) => {
    setFilters({ ...filters, location: value === "all" ? undefined : value });
  };

  const onSubmit = async (data: StationFormData) => {
    try {
      await createStation({
        name: data.name,
        location: data.location,
        max_capacity_kw: Number(data.max_capacity_kw),
      });
      toast.success("Station created successfully");
      setIsDialogOpen(false);
      reset();
    } catch (err) {
      toast.error("Failed to create station");
    }
  };

  const handleStatusToggle = async (
    id: string,
    currentStatus: "active" | "inactive",
  ) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await updateStationStatus(id, newStatus);
      toast.success(`Station status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update station status");
    }
  };

  if (loading)
    return <div className="flex justify-center p-8">Loading stations...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const uniqueLocations = Array.from(new Set(stations.map((s) => s.location)));

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Charging Stations</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Station</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Charging Station</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register("location", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_capacity_kw">Max Capacity (kW)</Label>
                <Input
                  id="max_capacity_kw"
                  type="number"
                  {...register("max_capacity_kw", {
                    required: true,
                    min: 0,
                  })}
                />
              </div>
              <Button type="submit" className="w-full">
                Create Station
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Status Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Location Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleLocationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stations.map((station) => (
          <Card key={station.id}>
            <CardHeader>
              <CardTitle>{station.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Location:</strong> {station.location}
                </p>
                <p>
                  <strong>Max Capacity:</strong> {station.max_capacity_kw} kW
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-medium ${station.status === "active" ? "text-green-600" : "text-red-600"}`}
                  >
                    {station.status}
                  </span>
                </p>
                <Button
                  variant={
                    station.status === "active" ? "destructive" : "default"
                  }
                  onClick={() => handleStatusToggle(station.id, station.status)}
                >
                  {station.status === "active" ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
