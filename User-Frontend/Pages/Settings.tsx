import React, { useState } from "react";
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
  FaEdit,
  FaSave,
} from "react-icons/fa";

interface HotelSettings {
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
}

const initialSettings: HotelSettings = {
  hotelName: "Travallee Boutique Hotel",
  owner: "Prabin Karki",
  contact: "+977 9812345678",
  location: "Lakeside, Pokhara, Nepal",
  propertyType: "Boutique Hotel",
  pricePerNight: "Rs. 8,500",
  checkIn: "02:00 PM",
  checkOut: "12:00 PM",
  description:
    "Luxury boutique hotel with mountain views, premium suites, rooftop dining, wellness spa, and curated local experiences.",
  facilities: [
    "Free WiFi",
    "Parking",
    "Spa",
    "Swimming Pool",
    "Breakfast",
    "Room Service",
  ],
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  ],
};

const facilityIcons: Record<string, React.ReactNode> = {
  "Free WiFi": <FaWifi />,
  Parking: <FaParking />,
  Spa: <FaSpa />,
  "Swimming Pool": <FaSwimmingPool />,
};

const SettingsPage: React.FC = () => {
  const [edit, setEdit] = useState(false);

  const [settings, setSettings] =
    useState<HotelSettings>(initialSettings);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

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
            {settings.hotelName}
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Manage hotel information, facilities,
            pricing, and property details.
          </p>
        </div>

        <button
          onClick={() => setEdit(!edit)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition ${
            edit
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {edit ? <FaSave /> : <FaEdit />}
          {edit ? "Save Changes" : "Edit Settings"}
        </button>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="text-sm text-slate-500">
            Average Rating
          </div>

          <div className="text-3xl font-bold text-slate-900 mt-2">
            4.8
          </div>

          <div className="text-sm text-emerald-600 mt-1">
            +0.3 this month
          </div>

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="text-sm text-slate-500">
            Total Reviews
          </div>

          <div className="text-3xl font-bold text-slate-900 mt-2">
            142
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
            74%
          </div>

          <div className="text-sm text-emerald-600 mt-1">
            High booking performance
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
                  name="hotelName"
                  value={settings.hotelName}
                  onChange={handleChange}
                  disabled={!edit}
                  className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500">
                  Owner Name
                </label>

                <input
                  name="owner"
                  value={settings.owner}
                  onChange={handleChange}
                  disabled={!edit}
                  className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500">
                  Contact
                </label>

                <div className="relative mt-2">

                  <FaPhoneAlt className="absolute top-4 left-4 text-slate-400 text-sm" />

                  <input
                    name="contact"
                    value={settings.contact}
                    onChange={handleChange}
                    disabled={!edit}
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                  />

                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500">
                  Property Type
                </label>

                <input
                  name="propertyType"
                  value={settings.propertyType}
                  onChange={handleChange}
                  disabled={!edit}
                  className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                />
              </div>

              <div className="md:col-span-2">

                <label className="text-xs font-medium text-slate-500">
                  Location
                </label>

                <div className="relative mt-2">

                  <FaMapMarkerAlt className="absolute top-4 left-4 text-slate-400 text-sm" />

                  <input
                    name="location"
                    value={settings.location}
                    onChange={handleChange}
                    disabled={!edit}
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
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
              name="description"
              value={settings.description}
              onChange={handleChange}
              disabled={!edit}
              rows={6}
              className="w-full border border-slate-200 rounded-xl px-4 py-4 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50 resize-none leading-7"
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

              {settings.images.map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-slate-200"
                >

                  <img
                    src={img}
                    alt=""
                    className="h-52 w-full object-cover hover:scale-105 transition duration-300"
                  />

                </div>
              ))}

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
                  name="pricePerNight"
                  value={settings.pricePerNight}
                  onChange={handleChange}
                  disabled={!edit}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                />

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <div className="text-xs text-slate-500 mb-2">
                    Check In
                  </div>

                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700">

                    <FaClock className="text-slate-400" />

                    {settings.checkIn}

                  </div>

                </div>

                <div>

                  <div className="text-xs text-slate-500 mb-2">
                    Check Out
                  </div>

                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700">

                    <FaClock className="text-slate-400" />

                    {settings.checkOut}

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

              {settings.facilities.map((facility, i) => (
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

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SettingsPage;