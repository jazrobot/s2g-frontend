import { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";

interface StationStatusData {
  active: number;
  inactive: number;
}

interface UseStationStatusReturn {
  data: StationStatusData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStationStatus(): UseStationStatusReturn {
  const [data, setData] = useState<StationStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<StationStatusData>("/analytics/stations/status-summary");
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch station status data");
      console.error("Error fetching station status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatus();
  }, [fetchStatus]);

  return {
    data,
    loading,
    error,
    refetch: fetchStatus,
  };
}