import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaBed, FaImage, FaMapMarkerAlt, FaMoneyBillWave, FaStar, FaUsers } from "react-icons/fa";
import { useAuth } from "../Contexts/Authcontext";
import { getRooms } from "../Services/hotel.api";

interface HotelRoom {
  _id?: string;
  roomNumber?: string;
  roomType?: string;
  suitetype?: string;
  roomDescription?: string;
  capacity?: number;
  maxOccupancy?: number;
  pricePerNight?: number;
  basePrice?: number;
  roomImages?: string[];
  amenities?: string[];
  bedType?: string;
  floorNumber?: number;
  status?: string;
}

const RoomDetails: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hotelId = auth?.hotelId;
  const selectedRoomId = searchParams.get("roomId");

  const [rooms, setRooms] = useState<HotelRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      if (!hotelId) {
        setError("No hotel id found in auth context.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getRooms(hotelId);
        const payload = res?.data ?? res;
        const roomList = Array.isArray(payload?.rooms)
          ? payload.rooms
          : Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.data)
              ? payload.data
              : [];

        setRooms(roomList);
      } catch (roomError) {
        console.error("Failed to load room details:", roomError);
        setError("Unable to load room details right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [hotelId]);

  const selectedRoom = useMemo(() => {
    if (!rooms.length) return null;
    return rooms.find((room) => String(room._id) === selectedRoomId || String(room.roomNumber) === selectedRoomId) ?? rooms[0];
  }, [rooms, selectedRoomId]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-2">
            <FaBed />
            Room Details
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Select a room number</h1>
          <p className="text-sm text-slate-500 mt-2">Click a room number from the list to view the full room card.</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/settings")}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Back to settings
        </button>
      </div>

      {loading && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-600">
          Loading room details...
        </div>
      )}

      {error && (
        <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Room Numbers</h2>
          <div className="grid grid-cols-2 gap-3">
            {rooms.map((room) => {
              const active = String(room._id) === selectedRoomId || String(room.roomNumber) === selectedRoomId;
              return (
                <button
                  key={room._id || room.roomNumber}
                  type="button"
                  onClick={() => navigate(`/dashboard/room-details?roomId=${room._id || room.roomNumber}`)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${active ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}
                >
                  <div className="text-2xl font-bold text-slate-900">{room.roomNumber || "N/A"}</div>
                  <div className="text-xs text-slate-500 mt-1">{room.status || "AVAILABLE"}</div>
                </button>
              );
            })}

            {!rooms.length && !loading && (
              <div className="col-span-full text-sm text-slate-500 border border-dashed border-slate-200 rounded-2xl p-6 text-center">
                No rooms found.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {selectedRoom ? (
            <div className="grid lg:grid-cols-[1.2fr_1fr]">
              <div className="relative min-h-[280px] bg-slate-100">
                <img
                  src={selectedRoom.roomImages?.[0] || "https://via.placeholder.com/900x700?text=Room+Preview"}
                  alt={`Room ${selectedRoom.roomNumber || "preview"}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 rounded-full bg-black/70 text-white text-xs px-3 py-1">
                  Room {selectedRoom.roomNumber || "N/A"}
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-slate-900">{selectedRoom.roomType || selectedRoom.suitetype || "Room details"}</h2>
                    <span className="text-[11px] px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 uppercase">
                      {selectedRoom.status || "AVAILABLE"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-7">{selectedRoom.roomDescription || "No room description available."}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 border border-slate-100">
                    <FaUsers className="text-slate-400" />
                    Capacity: {selectedRoom.capacity ?? selectedRoom.maxOccupancy ?? "N/A"}
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 border border-slate-100">
                    <FaMapMarkerAlt className="text-slate-400" />
                    Floor: {selectedRoom.floorNumber ?? "N/A"}
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 border border-slate-100">
                    <FaBed className="text-slate-400" />
                    Bed: {selectedRoom.bedType || "N/A"}
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 border border-slate-100">
                    <FaMoneyBillWave className="text-slate-400" />
                    Rs. {selectedRoom.pricePerNight ?? selectedRoom.basePrice ?? "N/A"}
                  </div>
                </div>

                {Array.isArray(selectedRoom.amenities) && selectedRoom.amenities.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoom.amenities.map((amenity) => (
                        <span key={amenity} className="text-[11px] px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="text-sm text-slate-500 flex items-center gap-2">
                    <FaImage className="text-slate-400" />
                    Room images and details for editing
                  </div>
                  <button
                    type="button"
                    className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition"
                  >
                    Edit details
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-sm text-slate-500">No room selected.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;