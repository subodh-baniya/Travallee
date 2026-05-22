import React, { useEffect, useMemo, useState } from "react";
import {
  FaHotel,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaImage,
  FaStar,
  FaWifi,
  FaParking,
  FaSpa,
  FaSwimmingPool,
  FaFileAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getHotelById, getRooms } from "../Services/hotel.api";
import { useAuth } from "../Contexts/Authcontext";

interface HotelSettings {
  _id?: string;
  hotelName: string;
  owner: string;
  contact: string;
  location: string;
  propertyType: string;
  pricePerNight: string;
  checkIn: string;
  checkOut: string;
  description: string;
  facilities: string[];
  images: string[];
  documents: string[];
  rating?: number;
  numberOfReviews?: number;
}

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

const facilityIcons: Record<string, React.ReactNode> = {
  "Free WiFi": <FaWifi />,
  Parking: <FaParking />,
  Spa: <FaSpa />,
  "Swimming Pool": <FaSwimmingPool />,
};

const SettingsPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const hotelId = auth?.hotelId;

  const [settings, setSettings] = useState<HotelSettings | null>(null);
  const [rooms, setRooms] = useState<HotelRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!hotelId) {
        setError("No hotel id found in auth context.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await getHotelById(hotelId);
        const hotel = res?.data ?? res;

        try {
          const roomRes = await getRooms(hotelId);
          const roomPayload = roomRes?.data ?? roomRes;
          const roomList = Array.isArray(roomPayload?.rooms)
            ? roomPayload.rooms
            : Array.isArray(roomPayload)
              ? roomPayload
              : Array.isArray(roomPayload?.data)
                ? roomPayload.data
                : [];

          setRooms(roomList);
        } catch (roomError) {
          console.error("Failed to fetch hotel rooms:", roomError);
          setRooms([]);
        }

        setSettings({
          _id: hotel?._id,
          hotelName: hotel?.hotelName || "Untitled hotel",
          owner: hotel?.ownerName || "Unknown owner",
          contact: hotel?.contactNumber || "Not provided",
          location: hotel?.hotelLocation || "Not provided",
          propertyType: hotel?.propertyType || "Not provided",
          pricePerNight: hotel?.pricePerNight ? `Rs. ${hotel.pricePerNight}` : "Not provided",
          checkIn: hotel?.checkinTime || "Not provided",
          checkOut: hotel?.checkoutTime || "Not provided",
          description: hotel?.hotelDescription || "No description available.",
          facilities: Array.isArray(hotel?.facilities) ? hotel.facilities : [],
          images: Array.isArray(hotel?.hotelImages) ? hotel.hotelImages : [],
          documents: Array.isArray(hotel?.VerificationDocuments) ? hotel.VerificationDocuments : [],
          rating: hotel?.rating,
          numberOfReviews: hotel?.numberOfReviews,
        });
      } catch (fetchError) {
        console.error("Failed to fetch hotel settings:", fetchError);
        setError("Unable to load hotel details right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  const stats = useMemo(() => {
    const rating = settings?.rating ?? 0;
    const reviews = settings?.numberOfReviews ?? 0;
    return {
      rating: rating.toFixed(1),
      reviews,
      occupancy: reviews > 0 ? Math.min(100, 50 + Math.round(reviews / 2)) : 0,
    };
  }, [settings]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">

      {/* HEADER */}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 shadow-sm">

        <div>
          <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-2">
            <FaHotel />
            Hotel Settings
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            {settings?.hotelName || "Loading hotel..."}
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            View hotel information, facilities, pricing, and property details from the authenticated hotel record.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
          {hotelId ? `Hotel ID: ${hotelId}` : "No hotel id available"}
        </div>

      </div>

      {loading && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-slate-600">
          Loading hotel details...
        </div>
      )}

      {error && (
        <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm text-red-600">
          {error}
        </div>
      )}

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="text-sm text-slate-500">
            Average Rating
          </div>

          <div className="text-3xl font-bold text-slate-900 mt-2">
            {stats.rating}
          </div>

          <div className="text-sm text-emerald-600 mt-1">
            Live from hotel record
          </div>

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="text-sm text-slate-500">
            Total Reviews
          </div>

          <div className="text-3xl font-bold text-slate-900 mt-2">
            {stats.reviews}
          </div>

          <div className="text-sm text-slate-500 mt-1">
            Guest feedback collected
          </div>

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="text-sm text-slate-500">
            Occupancy Rate
          </div>

          <div className="text-3xl font-bold text-slate-900 mt-2">
            {stats.occupancy}%
          </div>

          <div className="text-sm text-emerald-600 mt-1">
            Derived from current review volume
          </div>

        </div>

      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}

        <div className="xl:col-span-2 space-y-6">

          {/* BASIC INFO */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="text-xs font-medium text-slate-500">
                  Hotel Name
                </label>

                <input
                  value={settings?.hotelName || ""}
                  readOnly
                  className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none bg-slate-50 text-slate-700 cursor-default"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500">
                  Owner Name
                </label>

                <input
                  value={settings?.owner || ""}
                  readOnly
                  className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none bg-slate-50 text-slate-700 cursor-default"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500">
                  Contact
                </label>

                <div className="relative mt-2">

                  <FaPhoneAlt className="absolute top-4 left-4 text-slate-400 text-sm" />

                  <input
                    value={settings?.contact || ""}
                    readOnly
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none bg-slate-50 text-slate-700 cursor-default"
                  />

                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500">
                  Property Type
                </label>

                <input
                  value={settings?.propertyType || ""}
                  readOnly
                  className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none bg-slate-50 text-slate-700 cursor-default"
                />
              </div>

              <div className="md:col-span-2">

                <label className="text-xs font-medium text-slate-500">
                  Location
                </label>

                <div className="relative mt-2">

                  <FaMapMarkerAlt className="absolute top-4 left-4 text-slate-400 text-sm" />

                  <input
                    value={settings?.location || ""}
                    readOnly
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none bg-slate-50 text-slate-700 cursor-default"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900 mb-5">
              Hotel Description
            </h2>

            <textarea
              value={settings?.description || ""}
              readOnly
              rows={6}
              className="w-full border border-slate-200 rounded-xl px-4 py-4 text-sm outline-none bg-slate-50 text-slate-700 cursor-default resize-none leading-7"
            />

          </div>

          {/* IMAGES */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <div className="flex items-center gap-2 mb-5">

              <FaImage className="text-blue-600" />

              <h2 className="text-lg font-semibold text-slate-900">
                Hotel Gallery
              </h2>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {(settings?.images || []).map((img, i) => (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  onClick={() => setPreviewImage(img)}
                  onKeyDown={(event) => event.key === "Enter" && setPreviewImage(img)}
                  className="overflow-hidden rounded-2xl border border-slate-200 cursor-pointer"
                >

                  <img
                    src={img}
                    alt={`Hotel image ${i + 1}`}
                    className="h-52 w-full object-cover hover:scale-105 transition duration-300"
                  />

                </div>
              ))}

              {(settings?.images || []).length === 0 && (
                <div className="col-span-full text-sm text-slate-500 border border-dashed border-slate-200 rounded-2xl p-6 text-center">
                  No hotel images available.
                </div>
              )}

            </div>

            {previewImage && (
              <div
                className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                onClick={() => setPreviewImage(null)}
              >
                <div
                  className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Image preview</span>
                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="text-sm text-slate-500 hover:text-slate-900"
                    >
                      Close
                    </button>
                  </div>
                  <img src={previewImage} alt="Hotel preview" className="w-full max-h-[80vh] object-contain bg-black" />
                </div>
              </div>
            )}

          </div>

          {/* ROOMS */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Room Details
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Open a room to view or edit details in a separate page.
                </p>
              </div>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard/room-details")}
                  className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
                >
                  Open all rooms
                </button>
            </div>

              <div className="flex flex-wrap gap-3">
              {rooms.map((room, index) => (
                <div
                  key={room._id || room.roomNumber || index}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/dashboard/room-details?roomId=${room._id || room.roomNumber || index}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        navigate(`/dashboard/room-details?roomId=${room._id || room.roomNumber || index}`);
                      }
                    }}
                    className="min-w-[140px] flex-1 max-w-[180px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm hover:shadow-md hover:border-blue-200 hover:bg-blue-50 transition cursor-pointer"
                >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Room</div>
                        <div className="text-2xl font-bold text-slate-900">{room.roomNumber || "N/A"}</div>
                      </div>

                      <span className="text-[10px] px-2 py-1 rounded-full border border-slate-200 bg-white text-slate-600 uppercase">
                        {room.status || "AVAILABLE"}
                      </span>
                    </div>

                    <div className="mt-3 text-xs text-slate-500 line-clamp-2">
                      {room.roomType || room.suitetype || "Room details"}
                    </div>
                </div>
              ))}

              {rooms.length === 0 && !loading && (
                  <div className="w-full text-sm text-slate-500 border border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50">
                  No room details found for this hotel yet.
                </div>
              )}
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="space-y-6">

          {/* PRICING */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900 mb-5">
              Pricing & Timing
            </h2>

            <div className="space-y-5">

              <div>

                <div className="text-xs text-slate-500 mb-2">
                  Price Per Night
                </div>

                <input
                  value={settings?.pricePerNight || ""}
                  readOnly
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none bg-slate-50 text-slate-700 cursor-default"
                />

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <div className="text-xs text-slate-500 mb-2">
                    Check In
                  </div>

                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-slate-50">

                    <FaClock className="text-slate-400" />

                    {settings?.checkIn || "Not provided"}

                  </div>

                </div>

                <div>

                  <div className="text-xs text-slate-500 mb-2">
                    Check Out
                  </div>

                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-slate-50">

                    <FaClock className="text-slate-400" />

                    {settings?.checkOut || "Not provided"}

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* FACILITIES */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-slate-900 mb-5">
              Facilities
            </h2>

            <div className="grid grid-cols-2 gap-3">

              {(settings?.facilities || []).map((facility, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3"
                >

                  <div className="text-blue-600">
                    {facilityIcons[facility] || <FaStar />}
                  </div>

                  <span className="text-sm font-medium text-slate-700">
                    {facility}
                  </span>

                </div>
              ))}


                            {(settings?.facilities || []).length === 0 && (
                              <div className="col-span-full text-sm text-slate-500 border border-dashed border-slate-200 rounded-2xl p-6 text-center">
                                No facilities found.
                              </div>
                            )}
            </div>

          </div>


          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <FaFileAlt className="text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Verification Documents
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(settings?.documents || []).map((doc, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <img
                    src={doc}
                    alt={`Verification document ${index + 1}`}
                    className="h-64 w-full object-contain bg-white"
                  />
                  <div className="px-4 py-3 text-xs text-slate-500 border-t border-slate-200">
                    Verification document {index + 1}
                  </div>
                </div>
              ))}

              {(settings?.documents || []).length === 0 && (
                <div className="text-sm text-slate-500 border border-dashed border-slate-200 rounded-2xl p-6 text-center md:col-span-2">
                  No verification documents available.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SettingsPage;