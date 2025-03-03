import api from "@/lib/axios";
import { useCallback, useEffect, useState } from "react";

export interface Station {
  id: string;
  name: string;
  location: string;
  max_capacity_kw: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string | null;
}

export interface StationCreate {
  name: string;
  location: string;
  max_capacity_kw: number;
}

export interface StationUpdate {
  name?: string;
  location?: string;
  max_capacity_kw?: number;
  status?: "active" | "inactive";
}

export interface StationFilters {
  status?: string;
  min_capacity?: number;
  max_capacity?: number;
  location?: string;
}

export function useStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StationFilters>({});

  const fetchStations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<Station[]>("/analytics/stations/filtered-data", {
        params: filters,
      });
      setStations(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch stations");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createStation = async (data: StationCreate) => {
    try {
      const response = await api.post<Station>("/stations", data);
      setStations((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      throw new Error("Failed to create station");
    }
  };

  const updateStationStatus = async (
    id: string,
    status: "active" | "inactive",
  ) => {
    try {
      const response = await api.patch<Station>(`/stations/${id}/status`, {
        status,
      });
      setStations((prev) =>
        prev.map((station) => (station.id === id ? response.data : station)),
      );
      return response.data;
    } catch (err) {
      throw new Error("Failed to update station status");
    }
  };

  useEffect(() => {
    void fetchStations();
  }, [fetchStations]);

  return {
    stations,
    loading,
    error,
    filters,
    setFilters,
    createStation,
    updateStationStatus,
    refetch: fetchStations,
  };
}
