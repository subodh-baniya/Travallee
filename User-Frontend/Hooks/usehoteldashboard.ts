/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getDashboard } from "../Services/hotel.api";

export const useHotelDashboard = () => {
  const [statsData, setStatsData] = useState<any>({
    totalRevenue: 0,
    roomsOccupied: "0 / 0",
    todayCheckins: 0,
  });
  const [rooms, setRooms] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const result = await getDashboard();

        if (result.success && result.data) {
          setStatsData(result.data.stats || {
            totalRevenue: 0,
            roomsOccupied: "0 / 0",
            todayCheckins: 0,
          });
          setRooms(result.data.rooms || []);
          setCheckins(result.data.checkins || []);
        }
      } catch (err: any) {
        setError(err?.message || "Error loading dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return {
    statsData,
    rooms,
    checkins,
    loading,
    error,
  };
};