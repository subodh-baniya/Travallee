import { useEffect, useState } from "react";
import { getHotelDashboard } from "../Services/hotel.api";

export interface DashboardStats {
  totalRevenue: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  todayCheckins: number;
  averageRating?: number;
}

export interface DashboardRoom {
  roomNumber: string;
  floorNumber: number;
  roomType: string;
  status: "OCCUPIED" | "AVAILABLE" | "MAINTENANCE";
  pricePerNight: number;
}

export interface DashboardCheckin {
  guestName: string;
  roomNumber: string;
  checkInTime: string; 
}

export interface DashboardHotel {
  _id: string;
  hotelName: string;
  hotelLocation: string;
}

export const useHotelDashboard = () => {
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [rooms, setRooms] = useState<DashboardRoom[]>([]);
  const [checkins, setCheckins] = useState<DashboardCheckin[]>([]);
  const [hotel, setHotel] = useState<DashboardHotel | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await getHotelDashboard();
        const data = res.data;

        setStatsData(data.stats);
        setRooms(data.rooms);
        setCheckins(data.checkins);
        setHotel(data.hotel);
      } catch (err: Error | unknown) {
        const errorMessage = err instanceof Error ? err.message : "Dashboard load failed";
        setError(errorMessage);
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
    hotel,
    loading,
    error,
  };
};