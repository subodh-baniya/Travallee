/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getHotelInfo, getRooms } from "../Services/hotel.api";

export const useHotelDashboard = () => {
  const [hotel, setHotel] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const hotelRes = await getHotelInfo();
        const hotelData = hotelRes.data;

        setHotel(hotelData);

        const roomRes = await getRooms(hotelData._id);

        setRooms(roomRes.data.rooms);
        setPagination(roomRes.data.pagination);
      } catch (err: any) {
        setError(err?.message || "Error loading dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return {
    hotel,
    rooms,
    pagination,
    loading,
    error,
  };
};