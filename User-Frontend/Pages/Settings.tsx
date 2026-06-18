import React, { useEffect, useRef, useState } from "react";
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
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaCloudUploadAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { getHotelById } from "../Services/hotel.api";
import { hotelClient } from "../Services/httpclient/hotel.client";
import { useAuth } from "../Contexts/Authcontext";

interface HotelSettings {
  _id?: string;
  hotelName: string;
  ownerName: string;
  contactNumber: string;
  hotelLocation: string;
  propertyType: string;
  checkinTime: string;
  checkoutTime: string;
  hotelDescription: string;
  facilities: string[];
  images: string[];
  documents: string[];
}

const PROPERTY_TYPES = [
  "Hotel",
  "Resort",
  "Guesthouse",
  "Hostel",
  "Apartment",
  "Villa",
  "Boutique Hotel",
];

const facilityIcons: Record<string, React.ReactNode> = {
  "Free WiFi": <FaWifi />,
  Parking: <FaParking />,
  Spa: <FaSpa />,
  "Swimming Pool": <FaSwimmingPool />,
};

const emptyHotel: HotelSettings = {
  hotelName: "",
  ownerName: "",
  contactNumber: "",
  hotelLocation: "",
  propertyType: "",
  checkinTime: "",
  checkoutTime: "",
  hotelDescription: "",
  facilities: [],
  images: [],
  documents: [],
};

/* ─── Reusable small components ──────────────────────────────── */

const SectionCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`bg-white border border-slate-100 rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] ${className}`}
  >
    {children}
  </div>
);

const SectionHeader: React.FC<{
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ icon, title, subtitle, action }) => (
  <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-5 border-b border-slate-100">
    <div className="flex items-center gap-3">
      {icon && (
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 text-sm">
          {icon}
        </span>
      )}
      <div>
        <h2 className="text-base font-semibold text-slate-800 leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
    {children}
  </label>
);

const inputBase =
  "w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all duration-150";

const inputEditable =
  "border-slate-200 bg-white text-slate-800 placeholder:text-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100/60";

const inputReadonly =
  "border-transparent bg-slate-50 text-slate-600 cursor-default select-none";

const fieldInput = (editable: boolean) =>
  `${inputBase} ${editable ? inputEditable : inputReadonly}`;

const Toast: React.FC<{ type: "success" | "error"; message: string }> = ({ type, message }) => (
  <div
    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium animate-fade-in ${
      type === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-red-200 bg-red-50 text-red-700"
    }`}
  >
    {type === "success" ? (
      <FaCheckCircle className="shrink-0 text-emerald-500" />
    ) : (
      <FaExclamationCircle className="shrink-0 text-red-500" />
    )}
    {message}
  </div>
);

/* ─── Main component ──────────────────────────────────────────── */

const SettingsPage: React.FC = () => {
  const auth = useAuth();
  const hotelId = auth?.hotelId;
  const token = auth?.user?.token;

  const [settings, setSettings] = useState<HotelSettings>(emptyHotel);
  const [formData, setFormData] = useState<HotelSettings>(emptyHotel);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [facilityInput, setFacilityInput] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingImageFiles, setPendingImageFiles] = useState<File[]>([]);
  const [pendingImagePreviews, setPendingImagePreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);
  const [imageActionError, setImageActionError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const fetchHotel = async () => {
      if (!hotelId) { setError("No hotel ID found in auth context."); return; }
      setLoading(true);
      setError("");
      try {
        const res = await getHotelById(hotelId);
        const hotel = res?.data ?? res;
        const mapped: HotelSettings = {
          _id: hotel?._id,
          hotelName: hotel?.hotelName || "",
          ownerName: hotel?.ownerName || "",
          contactNumber: hotel?.contactNumber || "",
          hotelLocation: hotel?.hotelLocation || "",
          propertyType: hotel?.propertyType || "",
          checkinTime: hotel?.checkinTime || "",
          checkoutTime: hotel?.checkoutTime || "",
          hotelDescription: hotel?.hotelDescription || "",
          facilities: Array.isArray(hotel?.facilities) ? hotel.facilities : [],
          images: Array.isArray(hotel?.hotelImages) ? hotel.hotelImages : [],
          documents: Array.isArray(hotel?.VerificationDocuments) ? hotel.VerificationDocuments : [],
        };
        setSettings(mapped);
        setFormData(mapped);
      } catch (e) {
        console.error(e);
        setError("Unable to load hotel details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [hotelId]);

  const display = isEditing ? formData : settings;

  const handleField = (field: keyof HotelSettings, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const startEdit = () => {
    setFormData(settings);
    setIsEditing(true);
    setSaveError("");
    setSaveSuccess("");
  };

  const cancelEdit = () => {
    setFormData(settings);
    setFacilityInput("");
    setIsEditing(false);
    setSaveError("");
  };

  const addFacility = () => {
    const value = facilityInput.trim();
    if (!value || formData.facilities.includes(value)) { setFacilityInput(""); return; }
    handleField("facilities", [...formData.facilities, value]);
    setFacilityInput("");
  };

  const removeFacility = (index: number) =>
    handleField("facilities", formData.facilities.filter((_, i) => i !== index));

  const saveDetails = async () => {
    if (!hotelId) return;
    setSaving(true);
    setSaveError("");
    setSaveSuccess("");
    try {
      const payload = {
        hotelName: formData.hotelName,
        ownerName: formData.ownerName,
        contactNumber: formData.contactNumber,
        hotelLocation: formData.hotelLocation,
        propertyType: formData.propertyType,
        checkinTime: formData.checkinTime,
        checkoutTime: formData.checkoutTime,
        hotelDescription: formData.hotelDescription,
        facilities: formData.facilities,
      };
      await hotelClient.put(`/hotel/${hotelId}`, payload, {
        headers: authHeaders,
        withCredentials: true,
      });
      setSettings(formData);
      setIsEditing(false);
      setSaveSuccess("Hotel details saved successfully.");
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || "Failed to save hotel details.");
    } finally {
      setSaving(false);
    }
  };

  const handleSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const previews = files.map((f) => URL.createObjectURL(f));
    setPendingImageFiles((p) => [...p, ...files]);
    setPendingImagePreviews((p) => [...p, ...previews]);
  };

  const removePendingImage = (index: number) => {
    URL.revokeObjectURL(pendingImagePreviews[index]);
    setPendingImageFiles((p) => p.filter((_, i) => i !== index));
    setPendingImagePreviews((p) => p.filter((_, i) => i !== index));
  };

  const uploadPendingImages = async () => {
    if (!hotelId || !pendingImageFiles.length) return;
    setUploadingImages(true);
    setImageActionError("");
    try {
      const fd = new FormData();
      pendingImageFiles.forEach((f) => fd.append("hotelImages", f));
      const res = await hotelClient.post(`/hotel/${hotelId}/images`, fd, {
        headers: authHeaders,
        withCredentials: true,
      });
      const updatedImages: string[] =
        res?.data?.hotelImages || res?.data?.images || [...settings.images];
      setSettings((p) => ({ ...p, images: updatedImages }));
      setFormData((p) => ({ ...p, images: updatedImages }));
      pendingImagePreviews.forEach((u) => URL.revokeObjectURL(u));
      setPendingImageFiles([]);
      setPendingImagePreviews([]);
    } catch (err: any) {
      setImageActionError(err?.response?.data?.message || "Failed to upload images.");
    } finally {
      setUploadingImages(false);
    }
  };

  const deleteExistingImage = async (imageUrl: string) => {
    if (!hotelId) return;
    setDeletingImage(imageUrl);
    setImageActionError("");
    try {
      await hotelClient.delete(`/hotel/${hotelId}/images`, {
        headers: authHeaders,
        withCredentials: true,
        data: { imageUrl },
      });
      const updated = settings.images.filter((img) => img !== imageUrl);
      setSettings((p) => ({ ...p, images: updated }));
      setFormData((p) => ({ ...p, images: updated }));
    } catch (err: any) {
      setImageActionError(err?.response?.data?.message || "Failed to delete image.");
    } finally {
      setDeletingImage(null);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setChangingPassword(true);
    try {
      await hotelClient.put(
        `/hotel/${hotelId}/change-password`,
        { currentPassword, newPassword },
        { headers: authHeaders, withCredentials: true }
      );
      setPasswordSuccess("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err?.response?.data?.message || "Failed to update password.");
    } finally {
      setChangingPassword(false);
    }
  };

  /* ─── Render ──────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Page Header ───────────────────────────────────── */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-500 text-xs font-semibold uppercase tracking-widest mb-1">
              <FaHotel />
              Hotel Settings
            </div>
            {loading ? (
              <div className="h-7 w-48 bg-slate-100 rounded-lg animate-pulse" />
            ) : (
              <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                {settings.hotelName || "Your Hotel"}
              </h1>
            )}
            <p className="text-xs text-slate-400 mt-1">
              Manage your profile, gallery, documents and account security.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isEditing ? (
              <button
                type="button"
                onClick={startEdit}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-200"
              >
                <FaEdit className="text-xs" />
                Edit Details
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex items-center gap-2 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                >
                  <FaTimes className="text-xs" />
                  Discard
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={saveDetails}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FaSave className="text-xs" />
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status toasts */}
        {error && <Toast type="error" message={error} />}
        {saveError && <Toast type="error" message={saveError} />}
        {saveSuccess && <Toast type="success" message={saveSuccess} />}

        {/* ── Main Grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN ─────────────────────────────── */}
          <div className="xl:col-span-2 space-y-6">

            {/* Basic Info */}
            <SectionCard>
              <SectionHeader icon={<FaHotel />} title="Basic Information" subtitle="Core details visible to guests" />
              <div className="px-6 py-5 grid md:grid-cols-2 gap-5">

                <div>
                  <FieldLabel>Hotel Name</FieldLabel>
                  <input
                    value={display.hotelName}
                    readOnly={!isEditing}
                    onChange={(e) => handleField("hotelName", e.target.value)}
                    className={fieldInput(isEditing)}
                    placeholder="e.g. The Grand Himalaya"
                  />
                </div>

                <div>
                  <FieldLabel>Owner Name</FieldLabel>
                  <input
                    value={display.ownerName}
                    readOnly={!isEditing}
                    onChange={(e) => handleField("ownerName", e.target.value)}
                    className={fieldInput(isEditing)}
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <FieldLabel>Contact Number</FieldLabel>
                  <div className="relative">
                    <FaPhoneAlt className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-300 text-xs pointer-events-none" />
                    <input
                      value={display.contactNumber}
                      readOnly={!isEditing}
                      onChange={(e) => handleField("contactNumber", e.target.value)}
                      className={`${fieldInput(isEditing)} pl-10`}
                      placeholder="+977 98XXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Property Type</FieldLabel>
                  {isEditing ? (
                    <select
                      value={display.propertyType}
                      onChange={(e) => handleField("propertyType", e.target.value)}
                      className={`${inputBase} ${inputEditable} bg-white`}
                    >
                      <option value="">Select type</option>
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  ) : (
                    <input value={display.propertyType} readOnly className={fieldInput(false)} />
                  )}
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>Location</FieldLabel>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-300 text-xs pointer-events-none" />
                    <input
                      value={display.hotelLocation}
                      readOnly={!isEditing}
                      onChange={(e) => handleField("hotelLocation", e.target.value)}
                      className={`${fieldInput(isEditing)} pl-10`}
                      placeholder="City, District, Nepal"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Description */}
            <SectionCard>
              <SectionHeader title="About the Hotel" subtitle="Write a compelling description for guests" />
              <div className="px-6 py-5">
                <textarea
                  value={display.hotelDescription}
                  readOnly={!isEditing}
                  onChange={(e) => handleField("hotelDescription", e.target.value)}
                  rows={6}
                  placeholder={isEditing ? "Describe your property, atmosphere, and what makes it unique…" : ""}
                  className={`${fieldInput(isEditing)} resize-none leading-relaxed`}
                />
                {isEditing && (
                  <p className="text-xs text-slate-400 mt-1.5 text-right">
                    {display.hotelDescription.length} characters
                  </p>
                )}
              </div>
            </SectionCard>

            {/* Verification Documents — moved here from right column */}
            <SectionCard>
              <SectionHeader icon={<FaFileAlt />} title="Verification Documents" subtitle="Submitted during registration" />
              <div className="px-6 py-5">
                {settings.documents.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {settings.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="group overflow-hidden rounded-xl border border-slate-100 cursor-pointer hover:border-blue-200 hover:shadow-sm transition-all"
                        onClick={() => setPreviewImage(doc)}
                      >
                        <img
                          src={doc}
                          alt={`Document ${index + 1}`}
                          className="h-40 w-full object-contain bg-slate-50"
                        />
                        <div className="px-4 py-2.5 flex items-center gap-2 border-t border-slate-100 bg-white">
                          <FaFileAlt className="text-slate-300 text-xs" />
                          <span className="text-xs text-slate-500 font-medium">Document {index + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-8 text-center">
                    <FaFileAlt className="text-slate-300 text-xl" />
                    <p className="text-xs text-slate-400">No documents submitted</p>
                  </div>
                )}
              </div>
            </SectionCard>

          </div>

          {/* ── RIGHT COLUMN ────────────────────────────── */}
          <div className="space-y-6">

            {/* Check-in / Check-out */}
            <SectionCard>
              <SectionHeader icon={<FaClock />} title="Check-in & Check-out" subtitle="Guest arrival and departure times" />
              <div className="px-6 py-5 grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Check-in</FieldLabel>
                  {isEditing ? (
                    <input
                      value={display.checkinTime}
                      onChange={(e) => handleField("checkinTime", e.target.value)}
                      placeholder="e.g. 12:00 PM"
                      className={fieldInput(true)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
                      <FaClock className="text-slate-300 text-xs shrink-0" />
                      <span>{display.checkinTime || <span className="text-slate-400 italic">Not set</span>}</span>
                    </div>
                  )}
                </div>

                <div>
                  <FieldLabel>Check-out</FieldLabel>
                  {isEditing ? (
                    <input
                      value={display.checkoutTime}
                      onChange={(e) => handleField("checkoutTime", e.target.value)}
                      placeholder="e.g. 11:00 AM"
                      className={fieldInput(true)}
                    />
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
                      <FaClock className="text-slate-300 text-xs shrink-0" />
                      <span>{display.checkoutTime || <span className="text-slate-400 italic">Not set</span>}</span>
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>

            {/* Facilities */}
            <SectionCard>
              <SectionHeader title="Facilities" subtitle="Amenities available to guests" />
              <div className="px-6 py-5 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {display.facilities.map((facility, i) => (
                    <div
                      key={facility + i}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm"
                    >
                      <span className="text-blue-500 text-xs">{facilityIcons[facility] || <FaStar />}</span>
                      <span className="font-medium text-slate-700">{facility}</span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeFacility(i)}
                          className="text-slate-300 hover:text-rose-500 transition-colors ml-0.5 text-xs"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}

                  {display.facilities.length === 0 && (
                    <div className="w-full flex flex-col items-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-6 text-center">
                      <p className="text-xs text-slate-400">No facilities listed yet</p>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      value={facilityInput}
                      onChange={(e) => setFacilityInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFacility())}
                      placeholder="e.g. Free WiFi"
                      className={`flex-1 ${inputBase} ${inputEditable}`}
                    />
                    <button
                      type="button"
                      onClick={addFacility}
                      className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0"
                    >
                      <FaPlus className="text-xs" />
                      Add
                    </button>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Change Password — moved here from below verification docs */}
            <SectionCard>
              <SectionHeader icon={<FaLock />} title="Change Password" subtitle="Keep your account secure" />
              <div className="px-6 py-5 space-y-4">

                {/* Current password */}
                <div>
                  <FieldLabel>Current Password</FieldLabel>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`${inputBase} ${inputEditable} pr-11`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showCurrentPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div>
                  <FieldLabel>New Password</FieldLabel>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`${inputBase} ${inputEditable} pr-11`}
                      placeholder="Min. 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNewPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <FieldLabel>Confirm New Password</FieldLabel>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${inputBase} ${inputEditable}`}
                    placeholder="Re-enter new password"
                  />
                </div>

                {passwordError && <Toast type="error" message={passwordError} />}
                {passwordSuccess && <Toast type="success" message={passwordSuccess} />}

                <button
                  type="button"
                  disabled={changingPassword}
                  onClick={handleChangePassword}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
                >
                  {changingPassword ? "Updating…" : "Update Password"}
                </button>
              </div>
            </SectionCard>

          </div>
        </div>

        {/* ── Gallery — Full Width at Bottom ────────────────── */}
        <SectionCard>
          <SectionHeader
            icon={<FaImage />}
            title="Hotel Gallery"
            subtitle="Photos guests see when browsing"
            action={
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 text-xs font-semibold text-blue-700 transition-colors"
              >
                <FaCloudUploadAlt />
                Add Photos
              </button>
            }
          />
          <input
            ref={imageInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleSelectImages}
            className="hidden"
          />

          <div className="px-6 py-5 space-y-5">
            {imageActionError && <Toast type="error" message={imageActionError} />}

            {/* Existing images grid — more columns now full width */}
            {settings.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {settings.images.map((img, i) => (
                  <div
                    key={img + i}
                    className="relative group rounded-xl overflow-hidden border border-slate-100 bg-slate-50"
                  >
                    <img
                      src={img}
                      alt={`Hotel image ${i + 1}`}
                      onClick={() => setPreviewImage(img)}
                      className="h-44 w-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 pointer-events-none rounded-xl" />
                    <button
                      type="button"
                      disabled={deletingImage === img}
                      onClick={() => deleteExistingImage(img)}
                      className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 bg-white/95 text-rose-500 hover:text-rose-700 rounded-lg border border-white/50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-40 text-xs"
                      title="Remove photo"
                    >
                      {deletingImage === img ? "…" : <FaTrash />}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 rounded-2xl py-14 text-center">
                <FaImage className="text-slate-300 text-3xl" />
                <div>
                  <p className="text-sm font-medium text-slate-500">No photos yet</p>
                  <p className="text-xs text-slate-400">Add photos to attract more guests</p>
                </div>
              </div>
            )}

            {/* Pending uploads */}
            {pendingImagePreviews.length > 0 && (
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Ready to upload · {pendingImagePreviews.length} photo{pendingImagePreviews.length > 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
                  {pendingImagePreviews.map((src, idx) => (
                    <div
                      key={src}
                      className="relative rounded-xl overflow-hidden border-2 border-dashed border-blue-200 bg-blue-50/30"
                    >
                      <img src={src} alt="" className="h-36 w-full object-cover opacity-80" />
                      <button
                        type="button"
                        onClick={() => removePendingImage(idx)}
                        className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 text-xs shadow-sm"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={uploadingImages}
                  onClick={uploadPendingImages}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FaCloudUploadAlt />
                  {uploadingImages
                    ? "Uploading…"
                    : `Upload ${pendingImagePreviews.length} photo${pendingImagePreviews.length > 1 ? "s" : ""}`}
                </button>
              </div>
            )}
          </div>
        </SectionCard>

      </div>

      {/* ── Lightbox ──────────────────────────────────────────── */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-700">Preview</span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain bg-slate-950"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;