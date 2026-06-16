import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaPhoneAlt, FaMapMarkerAlt, FaClock,
  FaWifi, FaParking, FaSpa, FaSwimmingPool, FaStar,
  FaLock, FaTrash, FaCheck, FaExclamationTriangle,
} from "react-icons/fa";
import { getHotelById } from "../Services/hotel.api";
import { hotelClient } from "../Services/httpclient/hotel.client";
import { useAuth } from "../Contexts/Authcontext";

interface HotelSettings {
  _id?: string;
  hotelName: string;
  ownerName: string;
  contact: string;
  location: string;
  propertyType: string;
  pricePerNight: string;
  checkIn: string;
  checkOut: string;
  description: string;
  facilities: string[];
}

const facilityOptions = [
  { label: "Free WiFi",     icon: <FaWifi /> },
  { label: "Parking",       icon: <FaParking /> },
  { label: "Spa",           icon: <FaSpa /> },
  { label: "Swimming Pool", icon: <FaSwimmingPool /> },
  { label: "Restaurant",    icon: <FaStar /> },
  { label: "Gym",           icon: <FaStar /> },
  { label: "Bar",           icon: <FaStar /> },
  { label: "Room Service",  icon: <FaStar /> },
];

type Tab = "property" | "security";

const TABS: { id: Tab; label: string }[] = [
  { id: "property", label: "Property" },
  { id: "security", label: "Security" },
];

const SettingsPage = () => {
  const auth    = useAuth();
  const hotelId = auth?.hotelId || null;

  const [activeTab,   setActiveTab]   = useState<Tab>("property");
  const [loading,     setLoading]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [fetchError,  setFetchError]  = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saveError,   setSaveError]   = useState("");

  const [form, setForm] = useState<HotelSettings>({
    hotelName: "", ownerName: "", contact: "", location: "",
    propertyType: "", pricePerNight: "", checkIn: "", checkOut: "",
    description: "", facilities: [],
  });

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword,      setNewPassword]      = useState("");
  const [confirmPassword,  setConfirmPassword]  = useState("");
  const [passwordError,    setPasswordError]    = useState("");
  const [passwordSuccess,  setPasswordSuccess]  = useState("");
  const [savingPassword,   setSavingPassword]   = useState(false);

  const fetchHotel = useCallback(async () => {
    if (!hotelId) { setFetchError("No hotel found in session."); return; }
    setLoading(true);
    try {
      const res   = await getHotelById(hotelId);
      const hotel = res?.data ?? res;
      setForm({
        _id:          hotel?._id,
        hotelName:    hotel?.hotelName        || "",
        ownerName:    hotel?.ownerName        || "",
        contact:      hotel?.contactNumber    || "",
        location:     hotel?.hotelLocation    || "",
        propertyType: hotel?.propertyType     || "",
        pricePerNight: hotel?.pricePerNight ? String(hotel.pricePerNight) : "",
        checkIn:      hotel?.checkinTime      || "",
        checkOut:     hotel?.checkoutTime     || "",
        description:  hotel?.hotelDescription || "",
        facilities:   Array.isArray(hotel?.facilities) ? hotel.facilities : [],
      });
    } catch {
      setFetchError("Failed to load hotel details.");
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  useEffect(() => { fetchHotel(); }, [fetchHotel]);

  const handleField = (field: keyof HotelSettings, value: string) => {
    setSaveSuccess(""); setSaveError("");
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFacility = (label: string) => {
    setSaveSuccess(""); setSaveError("");
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(label)
        ? prev.facilities.filter((f) => f !== label)
        : [...prev.facilities, label],
    }));
  };

  const handleSaveProperty = async () => {
    if (!hotelId) return;
    setSaving(true); setSaveSuccess(""); setSaveError("");
    try {
      const token = auth?.user?.token;
      await hotelClient.put(
        `/hotel/${hotelId}`,
        {
          hotelName:       form.hotelName,
          ownerName:       form.ownerName,
          contactNumber:   form.contact,
          hotelLocation:   form.location,
          propertyType:    form.propertyType,
          pricePerNight:   Number(form.pricePerNight) || 0,
          checkinTime:     form.checkIn,
          checkoutTime:    form.checkOut,
          hotelDescription: form.description,
          facilities:      form.facilities,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {}, withCredentials: true }
      );
      setSaveSuccess("Hotel details saved successfully.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.msg;
      setSaveError(msg || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(""); setPasswordSuccess("");
    if (!newPassword || !currentPassword) { setPasswordError("Please fill in all password fields."); return; }
    if (newPassword !== confirmPassword)  { setPasswordError("New passwords do not match."); return; }
    if (newPassword.length < 8)           { setPasswordError("Password must be at least 8 characters."); return; }
    setSavingPassword(true);
    try {
      const token = auth?.user?.token;
      await hotelClient.post(
        "/auth/change-password",
        { currentPassword, newPassword },
        { headers: token ? { Authorization: `Bearer ${token}` } : {}, withCredentials: true }
      );
      setPasswordSuccess("Password updated successfully.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.msg;
      setPasswordError(msg || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  /* ── LOADING / ERROR STATES (matches Finance) ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-xs">
        Loading settings...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="m-6 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl px-4 py-3">
        {fetchError}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">

      {/* HEADER — matches Finance header pattern */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Settings</h1>
          <p className="text-xs text-slate-500">Manage your hotel profile and account security</p>
        </div>
        <button
          onClick={fetchHotel}
          className="text-xs text-blue-600 hover:underline"
        >
          Refresh
        </button>
      </div>

      {/* SAVE / ERROR BANNER */}
      {(saveSuccess || saveError) && (
        <div className={`border text-sm rounded-xl px-4 py-3 flex items-center gap-2 ${
          saveSuccess
            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
            : "bg-rose-50 border-rose-200 text-rose-600"
        }`}>
          {saveSuccess
            ? <><FaCheck className="text-xs flex-shrink-0" /> {saveSuccess}</>
            : <><FaExclamationTriangle className="text-xs flex-shrink-0" /> {saveError}</>
          }
        </div>
      )}

      {/* TAB BAR — same pill style as Finance filter buttons */}
      <div className="bg-white border border-slate-200 rounded-xl p-1 flex gap-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 text-xs rounded-lg transition font-medium ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── PROPERTY TAB ── */}
      {activeTab === "property" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-5"
        >
          {/* Hotel Information */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-800">Hotel information</p>
              <p className="text-xs text-slate-500 mt-0.5">Core details shown to guests across the platform</p>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-5">

              <Field label="Hotel name" required>
                <input
                  value={form.hotelName}
                  onChange={(e) => handleField("hotelName", e.target.value)}
                  placeholder="Grand Himalaya Hotel"
                  className={inputClass}
                />
              </Field>

              <Field label="Owner name" required>
                <input
                  value={form.ownerName}
                  onChange={(e) => handleField("ownerName", e.target.value)}
                  placeholder="Ramesh Shrestha"
                  className={inputClass}
                />
              </Field>

              <Field label="Contact number" required>
                <div className="relative">
                  <FaPhoneAlt className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-[10px] pointer-events-none" />
                  <input
                    value={form.contact}
                    onChange={(e) => handleField("contact", e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </Field>

              <Field label="Property type" required>
                <select
                  value={form.propertyType}
                  onChange={(e) => handleField("propertyType", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select type</option>
                  {["Hotel","Resort","Boutique Hotel","Guesthouse","Hostel","Apartment","Villa"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>

              <Field label="Location" required className="md:col-span-2">
                <div className="relative">
                  <FaMapMarkerAlt className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-[10px] pointer-events-none" />
                  <input
                    value={form.location}
                    onChange={(e) => handleField("location", e.target.value)}
                    placeholder="Thamel, Kathmandu"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </Field>

              <Field label="Description" className="md:col-span-2">
                <textarea
                  value={form.description}
                  onChange={(e) => handleField("description", e.target.value)}
                  rows={3}
                  placeholder="Describe your property for guests..."
                  className={`${inputClass} resize-none leading-6`}
                />
              </Field>

            </div>
          </div>

          {/* Pricing & Check-in */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-800">Pricing & check-in</p>
              <p className="text-xs text-slate-500 mt-0.5">Set your base nightly rate and arrival times</p>
            </div>
            <div className="p-6 grid md:grid-cols-3 gap-5">

              <Field label="Base price / night (Rs.)" required>
                <input
                  value={form.pricePerNight}
                  onChange={(e) => handleField("pricePerNight", e.target.value)}
                  type="number" min="0" placeholder="3500"
                  className={inputClass}
                />
              </Field>

              <Field label="Check-in time" required>
                <div className="relative">
                  <FaClock className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-[10px] pointer-events-none" />
                  <input
                    value={form.checkIn}
                    onChange={(e) => handleField("checkIn", e.target.value)}
                    placeholder="14:00"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </Field>

              <Field label="Check-out time" required>
                <div className="relative">
                  <FaClock className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 text-[10px] pointer-events-none" />
                  <input
                    value={form.checkOut}
                    onChange={(e) => handleField("checkOut", e.target.value)}
                    placeholder="11:00"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </Field>

            </div>
          </div>

          {/* Facilities */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-800">Facilities</p>
              <p className="text-xs text-slate-500 mt-0.5">Select amenities available at your property</p>
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {facilityOptions.map(({ label, icon }) => {
                const active = form.facilities.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleFacility(label)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className={active ? "text-blue-500" : "text-slate-400"}>{icon}</span>
                    {label}
                    {active && <FaCheck className="ml-auto text-blue-500 text-[10px]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save bar */}
          <div className="flex justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveProperty}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </motion.div>
      )}

      {/* ── SECURITY TAB ── */}
      {activeTab === "security" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-5"
        >
          {/* Change password */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <FaLock className="text-slate-400 text-xs" />
              <div>
                <p className="text-sm font-medium text-slate-800">Change password</p>
                <p className="text-xs text-slate-500 mt-0.5">Use a strong password you don't use anywhere else</p>
              </div>
            </div>
            <div className="p-6 max-w-md space-y-4">

              <Field label="Current password">
                <input
                  type="password" value={currentPassword}
                  onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(""); setPasswordSuccess(""); }}
                  placeholder="••••••••" className={inputClass} autoComplete="current-password"
                />
              </Field>

              <Field label="New password">
                <input
                  type="password" value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPasswordError(""); setPasswordSuccess(""); }}
                  placeholder="At least 8 characters" className={inputClass} autoComplete="new-password"
                />
              </Field>

              <Field label="Confirm new password">
                <input
                  type="password" value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(""); setPasswordSuccess(""); }}
                  placeholder="Repeat new password" className={inputClass} autoComplete="new-password"
                />
              </Field>

              {passwordError && (
                <p className="text-xs text-rose-500 flex items-center gap-2">
                  <FaExclamationTriangle className="flex-shrink-0" /> {passwordError}
                </p>
              )}
              {passwordSuccess && (
                <p className="text-xs text-emerald-600 flex items-center gap-2">
                  <FaCheck className="flex-shrink-0" /> {passwordSuccess}
                </p>
              )}

              <button
                type="button" disabled={savingPassword} onClick={handleChangePassword}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition"
              >
                {savingPassword ? "Updating…" : "Update password"}
              </button>

            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-800">Danger zone</p>
              <p className="text-xs text-slate-500 mt-0.5">Irreversible actions — proceed with caution</p>
            </div>
            <div className="p-6">
              <div className="border border-rose-200 rounded-lg p-4 flex items-center justify-between gap-4 bg-rose-50">
                <div>
                  <p className="text-xs font-semibold text-rose-700 flex items-center gap-2">
                    <FaTrash className="text-[10px]" /> Delete hotel account
                  </p>
                  <p className="text-xs text-rose-500 mt-1">
                    Permanently removes your hotel, rooms, and bookings. This cannot be undone.
                  </p>
                </div>
                <button
                  type="button"
                  className="flex-shrink-0 px-3 py-1.5 border border-rose-300 text-rose-600 text-xs font-medium rounded-lg hover:bg-rose-100 transition"
                >
                  Delete account
                </button>
              </div>
            </div>
          </div>

        </motion.div>
      )}

    </div>
  );
};

/* ── Helpers ── */

const inputClass =
  "w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 transition";

function Field({
  label, required, children, className = "",
}: {
  label: string; required?: boolean; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default SettingsPage;