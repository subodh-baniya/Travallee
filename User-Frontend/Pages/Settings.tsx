import React, { useEffect, useMemo, useState, useRef } from "react";
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
import { hotelClient } from "../Services/httpclient/hotel.client";
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
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newRoomType, setNewRoomType] = useState("");
  const [newBasePrice, setNewBasePrice] = useState("");
  const [newCapacity, setNewCapacity] = useState("");
  const [newAmenities, setNewAmenities] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFloor, setNewFloor] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [newSuiteType, setNewSuiteType] = useState("");
  const [newMaxOccupancy, setNewMaxOccupancy] = useState("");
  const [newBedType, setNewBedType] = useState("");
  const [newRoomSize, setNewRoomSize] = useState("");
  const [newViewType, setNewViewType] = useState("none");
  const [newPricePerNight, setNewPricePerNight] = useState("");
  const [newWeekendPrice, setNewWeekendPrice] = useState("");
  const [newTaxRate, setNewTaxRate] = useState("");
  const [newMinStayNights, setNewMinStayNights] = useState("");
  const [newCancellationPolicy, setNewCancellationPolicy] = useState("");
  const [newSpecialFeatures, setNewSpecialFeatures] = useState("");
  const [newRoomImages, setNewRoomImages] = useState<File[]>([]);
  const [newRoomImagePreviews, setNewRoomImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [newIsAccessible, setNewIsAccessible] = useState(false);
  const [newHasBathtub, setNewHasBathtub] = useState(false);
  const [newHasShower, setNewHasShower] = useState(false);
  const [newHasBalcony, setNewHasBalcony] = useState(false);
  const [newHasAC, setNewHasAC] = useState(true);
  const [newHasHeating, setNewHasHeating] = useState(false);
  const [newHasWifi, setNewHasWifi] = useState(true);
  const [newIsActive, setNewIsActive] = useState(true);
  const [newIsFeatured, setNewIsFeatured] = useState(false);
  const [newRating, setNewRating] = useState("0");
  const [newNumberOfReviews, setNewNumberOfReviews] = useState("0");
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);

  const createRoomSubmit = async () => {
    setCreateError("");
    setCreateSuccess("");
    if (!hotelId) {
      setCreateError("No hotel id available");
      return;
    }
    if (!newRoomNumber) {
      setCreateError("Room number is required");
      return;
    }

    // validate required fields per Room.model.ts
    if (!newRoomNumber || !newRoomType || !newSuiteType || !newDescription || !newMaxOccupancy || !newCapacity || !newBedType || !newBasePrice || !newPricePerNight || !newCancellationPolicy || !newAmenities) {
      setCreateError("Please fill all required fields marked with *");
      return;
    }
    if (!newRoomImages || newRoomImages.length === 0) {
      setCreateError("Please upload at least one room image");
      return;
    }

    setCreatingRoom(true);
    try {
      const token = auth?.user?.token;
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      // If user attached local File objects, send multipart/form-data (server will upload files)
      if (newRoomImages && newRoomImages.length > 0) {
        const fd = new FormData();
        fd.append("hotelId", String(hotelId));
        fd.append("roomNumber", newRoomNumber);
        if (newRoomType) fd.append("roomType", newRoomType);
        if (newSuiteType) fd.append("suitetype", newSuiteType);
        if (newBasePrice) fd.append("basePrice", String(Number(newBasePrice) || 0));
        if (newPricePerNight) fd.append("pricePerNight", String(Number(newPricePerNight) || 0));
        if (newWeekendPrice) fd.append("weekendPrice", String(Number(newWeekendPrice) || 0));
        if (newCapacity) fd.append("capacity", String(Number(newCapacity) || 1));
        if (newMaxOccupancy) fd.append("maxOccupancy", String(Number(newMaxOccupancy) || 1));
        if (newRoomSize) fd.append("roomSize", String(Number(newRoomSize) || 0));
        if (newBedType) fd.append("bedType", newBedType);
        if (newFloor) fd.append("floorNumber", String(Number(newFloor) || 0));
        if (newViewType) fd.append("viewType", newViewType);
        if (newDescription) fd.append("roomDescription", newDescription);
        if (newCancellationPolicy) fd.append("cancellationPolicy", newCancellationPolicy);
        if (newMinStayNights) fd.append("minStayNights", String(Number(newMinStayNights) || 1));
        if (newTaxRate) fd.append("taxRate", String(Number(newTaxRate) || 0));
        if (newSpecialFeatures) fd.append("specialFeatures", JSON.stringify(newSpecialFeatures.split(",").map(s => s.trim()).filter(Boolean)));
        if (newAmenities) fd.append("amenities", JSON.stringify(newAmenities.split(",").map(s => s.trim()).filter(Boolean)));

        // booleans
        fd.append("isAccessible", String(newIsAccessible));
        fd.append("hasBathtub", String(newHasBathtub));
        fd.append("hasShower", String(newHasShower));
        fd.append("hasBalcony", String(newHasBalcony));
        fd.append("hasAC", String(newHasAC));
        fd.append("hasHeating", String(newHasHeating));
        fd.append("hasWifi", String(newHasWifi));
        fd.append("isActive", String(newIsActive));
        fd.append("isFeatured", String(newIsFeatured));
        fd.append("rating", String(Number(newRating) || 0));
        fd.append("numberOfReviews", String(Number(newNumberOfReviews) || 0));

        // images (multiple files)
        newRoomImages.forEach((file) => {
          fd.append("roomImages", file);
        });

        // Debug: log FormData entries so we can compare with Postman
        try {
          for (const entry of fd.entries()) {
            console.log("FormData entry:", entry[0], entry[1]);
          }
        } catch (logErr) {
          console.warn("Failed to enumerate FormData entries:", logErr);
        }

        await hotelClient.post(`/room/${hotelId}`, fd, {
          headers,
          withCredentials: true,
        });
      } else {
        // Build JSON payload aligned with backend createRoomSchema
        const payload: any = {
          hotelId,
          roomNumber: String(newRoomNumber || ""),
          roomType: String(newRoomType || ""),
          suitetype: String(newSuiteType || ""),
          roomDescription: String(newDescription || ""),

          // numeric fields
          maxOccupancy: Number(newMaxOccupancy) || Number(newCapacity) || 1,
          capacity: Number(newCapacity) || 1,
          roomSize: newRoomSize ? Number(newRoomSize) : undefined,
          bedType: String(newBedType || ""),
          floorNumber: Number(newFloor) || 0,
          viewType: newViewType || "none",

          // pricing
          basePrice: Number(newBasePrice) || 0,
          pricePerNight: Number(newPricePerNight) || Number(newBasePrice) || 0,
          weekendPrice: newWeekendPrice ? Number(newWeekendPrice) : undefined,
          taxRate: Number(newTaxRate) || 0,

          // policies
          minStayNights: Number(newMinStayNights) || 1,
          cancellationPolicy: String(newCancellationPolicy || ""),

          // arrays
          amenities: newAmenities ? newAmenities.split(",").map(s => s.trim()).filter(Boolean) : [],
          specialFeatures: newSpecialFeatures ? newSpecialFeatures.split(",").map(s => s.trim()).filter(Boolean) : [],

          // images: prefer server-uploaded URLs; fallback to previews (note: preview blobs are not permanent URLs)
          roomImages: (newRoomImagePreviews && newRoomImagePreviews.length > 0)
            ? newRoomImagePreviews.filter(p => typeof p === 'string')
            : [],

          // booleans and flags
          isAccessible: Boolean(newIsAccessible),
          hasBathtub: Boolean(newHasBathtub),
          hasShower: Boolean(newHasShower),
          hasBalcony: Boolean(newHasBalcony),
          hasAC: Boolean(newHasAC),
          hasHeating: Boolean(newHasHeating),
          hasWifi: Boolean(newHasWifi),

          // status/rating defaults
          isActive: Boolean(newIsActive),
          isFeatured: Boolean(newIsFeatured),
          rating: Number(newRating) || 0,
          numberOfReviews: Number(newNumberOfReviews) || 0,
        };

        console.log("JSON payload:", payload);

        await hotelClient.post(`/room/${hotelId}`, payload, {
          headers,
          withCredentials: true,
        });
      }
      setCreateSuccess("Room created successfully");
      setNewRoomNumber("");
      setNewRoomType("");
      setNewBasePrice("");
      setNewCapacity("");
      setNewAmenities("");
      setNewDescription("");
      setNewFloor("");

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
      } catch (e) {
        // ignore refresh errors
      }
    } catch (err: any) {
      console.error("Create room error:", err);
      const resp = err?.response?.data;
      if (resp) {
        // Prefer validation array or data payload if present
        if (Array.isArray(resp) && resp.length > 0) {
          setCreateError(JSON.stringify(resp, null, 2));
        } else if (resp?.data) {
          setCreateError(typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data, null, 2));
        } else if (resp?.errors) {
          setCreateError(JSON.stringify(resp.errors, null, 2));
        } else if (resp?.message || resp?.msg) {
          setCreateError(String(resp.message || resp.msg));
        } else {
          setCreateError(JSON.stringify(resp, null, 2));
        }
      } else {
        setCreateError(String(err));
      }
    } finally {
      setCreatingRoom(false);
      setShowCreateDrawer(false);
    }
  };

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
      rating: rating > 0 ? rating.toFixed(1) : "N/A",
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

          {/* Create room drawer (right side) */}
          <div
            aria-hidden={!showCreateDrawer}
            className={`fixed inset-y-0 right-0 z-50 w-96 bg-white border-l border-slate-200 shadow-2xl transform transition-transform duration-350 ${showCreateDrawer ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ display: 'flex', flexDirection: 'column', maxHeight: '100vh' }}
          >
            <div className="p-6 flex items-center justify-between border-b border-slate-100">
              <div className="font-semibold text-lg">Quick Add Room</div>
              <button onClick={() => setShowCreateDrawer(false)} className="text-sm text-slate-500">Close</button>
            </div>
            <div className="p-6 flex-1 flex flex-col relative">
              <div className="space-y-4 text-base pb-36" style={{ WebkitOverflowScrolling: 'touch', height: 'calc(100vh - 220px)', overflowY: 'auto' }}>
                <div>
                  <label className="text-sm font-medium">Room number <span className="text-rose-600">*</span></label>
                  <input placeholder="101" value={newRoomNumber} onChange={(e) => setNewRoomNumber(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                </div>

                <div>
                  <label className="text-sm font-medium">Room type <span className="text-rose-600">*</span></label>
                  <input placeholder="deluxe" value={newRoomType} onChange={(e) => setNewRoomType(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                </div>

                <div>
                  <label className="text-sm font-medium">Suite type <span className="text-rose-600">*</span></label>
                  <input placeholder="junior" value={newSuiteType} onChange={(e) => setNewSuiteType(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Base price <span className="text-rose-600">*</span></label>
                    <input placeholder="150" value={newBasePrice} onChange={(e) => setNewBasePrice(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Price per night <span className="text-rose-600">*</span></label>
                    <input placeholder="150" value={newPricePerNight} onChange={(e) => setNewPricePerNight(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Capacity <span className="text-rose-600">*</span></label>
                    <input placeholder="2" value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Max occupancy <span className="text-rose-600">*</span></label>
                    <input placeholder="2" value={newMaxOccupancy} onChange={(e) => setNewMaxOccupancy(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Bed type <span className="text-rose-600">*</span></label>
                    <input placeholder="queen" value={newBedType} onChange={(e) => setNewBedType(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Room size (sqm)</label>
                    <input placeholder="20" value={newRoomSize} onChange={(e) => setNewRoomSize(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">View type <span className="text-rose-600">*</span></label>
                  <select value={newViewType} onChange={(e) => setNewViewType(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1 bg-white">
                    <option value="none">none</option>
                    <option value="city">city</option>
                    <option value="garden">garden</option>
                    <option value="beach">beach</option>
                    <option value="mountain">mountain</option>
                    <option value="street">street</option>
                    <option value="pool">pool</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Amenities (comma separated) <span className="text-rose-600">*</span></label>
                  <input placeholder="wifi,ac,tv" value={newAmenities} onChange={(e) => setNewAmenities(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                </div>

                <div>
                  <label className="text-sm font-medium">Special features (comma separated)</label>
                  <input placeholder="sea view,king bed" value={newSpecialFeatures} onChange={(e) => setNewSpecialFeatures(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                </div>

                <div>
                  <label className="text-sm font-medium">Cancellation policy <span className="text-rose-600">*</span></label>
                  <input placeholder="48 hours free cancellation" value={newCancellationPolicy} onChange={(e) => setNewCancellationPolicy(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Tax rate <span className="text-rose-600">*</span></label>
                    <input placeholder="0" value={newTaxRate} onChange={(e) => setNewTaxRate(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Min stay nights <span className="text-rose-600">*</span></label>
                    <input placeholder="1" value={newMinStayNights} onChange={(e) => setNewMinStayNights(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Rating <span className="text-rose-600">*</span></label>
                    <input placeholder="0" value={newRating} onChange={(e) => setNewRating(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Number of reviews <span className="text-rose-600">*</span></label>
                    <input placeholder="0" value={newNumberOfReviews} onChange={(e) => setNewNumberOfReviews(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Description <span className="text-rose-600">*</span></label>
                  <textarea placeholder="Spacious room with city view" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={4} className="w-full border border-slate-200 rounded-xl px-3 py-3 text-base mt-1" />
                </div>

                <div>
                  <label className="text-sm font-medium">Images (at least 1) <span className="text-rose-600">*</span></label>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm"
                    >
                      Choose images
                    </button>
                    <div className="text-sm text-slate-500">{newRoomImages.length} selected</div>
                  </div>
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    // revoke previous urls
                    newRoomImagePreviews.forEach(url => URL.revokeObjectURL(url));
                    const previews = files.map(f => URL.createObjectURL(f));
                    setNewRoomImages(files);
                    setNewRoomImagePreviews(previews);
                  }} className="hidden" />

                  {newRoomImagePreviews.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {newRoomImagePreviews.map((src, idx) => (
                        <div key={src} className="relative">
                          <img src={src} alt={`preview-${idx}`} className="h-20 w-full object-cover rounded-md border" />
                          <button type="button" onClick={() => {
                            // remove one
                            const updatedFiles = newRoomImages.filter((_, i) => i !== idx);
                            const updatedPreviews = newRoomImagePreviews.filter((_, i) => i !== idx);
                            // revoke removed url
                            URL.revokeObjectURL(src);
                            setNewRoomImages(updatedFiles);
                            setNewRoomImagePreviews(updatedPreviews);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }} className="absolute -top-1 -right-1 bg-white rounded-full p-1 text-xs border">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-sm">Accessible</label>
                  <input type="checkbox" checked={newIsAccessible} onChange={(e) => setNewIsAccessible(e.target.checked)} />

                  <label className="text-sm">Bathtub</label>
                  <input type="checkbox" checked={newHasBathtub} onChange={(e) => setNewHasBathtub(e.target.checked)} />

                  <label className="text-sm">Shower</label>
                  <input type="checkbox" checked={newHasShower} onChange={(e) => setNewHasShower(e.target.checked)} />

                  <label className="text-sm">Balcony</label>
                  <input type="checkbox" checked={newHasBalcony} onChange={(e) => setNewHasBalcony(e.target.checked)} />

                  <label className="text-sm">AC</label>
                  <input type="checkbox" checked={newHasAC} onChange={(e) => setNewHasAC(e.target.checked)} />

                  <label className="text-sm">Heating</label>
                  <input type="checkbox" checked={newHasHeating} onChange={(e) => setNewHasHeating(e.target.checked)} />

                  <label className="text-sm">Wifi</label>
                  <input type="checkbox" checked={newHasWifi} onChange={(e) => setNewHasWifi(e.target.checked)} />

                  <label className="text-sm">Active</label>
                  <input type="checkbox" checked={newIsActive} onChange={(e) => setNewIsActive(e.target.checked)} />

                  <label className="text-sm">Featured</label>
                  <input type="checkbox" checked={newIsFeatured} onChange={(e) => setNewIsFeatured(e.target.checked)} />
                </div>

                {createError && <div className="text-sm text-red-600">{createError}</div>}
                {createSuccess && <div className="text-sm text-emerald-600">{createSuccess}</div>}
              </div>
            </div>
            {/* footer with persistent actions (fixed inside drawer) */}
            <div className="border-t p-4 bg-white flex items-center justify-end gap-2 h-20 absolute left-0 right-0 bottom-0" style={{ zIndex: 60 }}>
              <button
                type="button"
                onClick={() => {
                  setNewRoomNumber(''); setNewRoomType(''); setNewSuiteType(''); setNewBasePrice(''); setNewPricePerNight(''); setNewWeekendPrice(''); setNewTaxRate(''); setNewCapacity(''); setNewMaxOccupancy(''); setNewRoomSize(''); setNewBedType(''); setNewAmenities(''); setNewSpecialFeatures(''); setNewFloor(''); setNewMinStayNights(''); setNewDescription(''); setNewViewType('none'); setNewRoomImages([]); setNewIsAccessible(false); setNewHasBathtub(false); setNewHasShower(false); setNewHasBalcony(false); setNewHasHeating(false); setNewHasAC(true); setNewHasWifi(true); setNewIsActive(true); setNewIsFeatured(false); setNewRating('0'); setNewNumberOfReviews('0'); setCreateError(''); setCreateSuccess('');
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Reset
              </button>

              <button
                type="button"
                disabled={creatingRoom}
                onClick={() => void createRoomSubmit()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 text-sm font-semibold shadow"
              >
                {creatingRoom ? 'Creating...' : 'Create Room'}
              </button>
            </div>
          </div>

          {showCreateDrawer && <div onClick={() => setShowCreateDrawer(false)} className="fixed inset-0 z-40 bg-black/30"></div>}

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
                <button
                  type="button"
                  onClick={() => setShowCreateDrawer(true)}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 hover:bg-rose-100 transition"
                >
                  Quick Add Room
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