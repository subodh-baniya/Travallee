import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateRoomInfo, updateRoomImages } from "../../Services/hotel.api"; 
import { Toast } from "../modal-popups/Toast"; 
import { useToast } from "../../Hooks/useToast";

export interface Room {
  _id: string;
  hotelId: string;
  roomNumber: string;
  roomType: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  pricePerNight: number;
  basePrice?: number;
  weekendPrice?: number;
  capacity: number;
  maxOccupancy?: number;
  floorNumber: number;
  rating: number;
  numberOfReviews?: number;
  discount: number;
  amenities?: string[];
  specialFeatures?: string[];
  roomImages?: string[];
  roomDescription?: string;
  bedType?: string;
  roomSize?: number;
  viewType?: string;
  suitetype?: string;
  cancellationPolicy?: string;
  taxRate?: number;
  minStayNights?: number;
  hasWifi?: boolean;
  hasAC?: boolean;
  hasBalcony?: boolean;
  hasBathtub?: boolean;
  hasShower?: boolean;
  hasHeating?: boolean;
  isAccessible?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface RoomDetailModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onRoomUpdated?: (updatedRoom: Room) => void;
}

// constants
const statusConfig: Record<string, { label: string; cls: string }> = {
  AVAILABLE:   { label: "Available",   cls: "bg-emerald-500/90 text-white" },
  OCCUPIED:    { label: "Occupied",    cls: "bg-blue-500/90 text-white" },
  MAINTENANCE: { label: "Maintenance", cls: "bg-rose-500/90 text-white" },
};

const statusOptions: Room["status"][] = ["AVAILABLE", "OCCUPIED", "MAINTENANCE"];

const boolFeatures = [
  { key: "hasWifi",      icon: "📶", label: "Wi-Fi" },
  { key: "hasAC",        icon: "❄️",  label: "Air Con" },
  { key: "hasBalcony",   icon: "🏞️",  label: "Balcony" },
  { key: "hasBathtub",   icon: "🛁",  label: "Bathtub" },
  { key: "hasShower",    icon: "🚿",  label: "Shower" },
  { key: "hasHeating",   icon: "🔥",  label: "Heating" },
  { key: "isAccessible", icon: "♿",  label: "Accessible" },
  { key: "isFeatured",   icon: "★",  label: "Featured" },
  { key: "isActive",     icon: "✓",  label: "Active" },
] as const;

// edit form state
interface EditFormState {
  roomNumber: string;
  status: Room["status"];
  roomType: string;
  suitetype: string;
  viewType: string;
  bedType: string;
  floorNumber: number;
  capacity: number;
  maxOccupancy: number;
  roomSize: number;
  basePrice: number;
  pricePerNight: number;
  weekendPrice: number;
  taxRate: number;
  minStayNights: number;
  discount: number;
  roomDescription: string;
  cancellationPolicy: string;
  amenitiesText: string;
  specialFeaturesText: string;
  hasWifi: boolean;
  hasAC: boolean;
  hasBalcony: boolean;
  hasBathtub: boolean;
  hasShower: boolean;
  hasHeating: boolean;
  isAccessible: boolean;
  isFeatured: boolean;
  isActive: boolean;
}

const initFormData = (r: Room): EditFormState => ({
  roomNumber: r.roomNumber,
  status: r.status,
  roomType: r.roomType,
  suitetype: r.suitetype ?? "",
  viewType: r.viewType ?? "",
  bedType: r.bedType ?? "",
  floorNumber: r.floorNumber,
  capacity: r.capacity,
  maxOccupancy: r.maxOccupancy ?? r.capacity,
  roomSize: r.roomSize ?? 0,
  basePrice: r.basePrice ?? r.pricePerNight,
  pricePerNight: r.pricePerNight,
  weekendPrice: r.weekendPrice ?? r.pricePerNight,
  taxRate: r.taxRate ?? 0,
  minStayNights: r.minStayNights ?? 1,
  discount: r.discount ?? 0,
  roomDescription: r.roomDescription ?? "",
  cancellationPolicy: r.cancellationPolicy ?? "",
  amenitiesText: (r.amenities ?? []).join(", "),
  specialFeaturesText: (r.specialFeatures ?? []).join(", "),
  hasWifi: !!r.hasWifi,
  hasAC: !!r.hasAC,
  hasBalcony: !!r.hasBalcony,
  hasBathtub: !!r.hasBathtub,
  hasShower: !!r.hasShower,
  hasHeating: !!r.hasHeating,
  isAccessible: !!r.isAccessible,
  isFeatured: !!r.isFeatured,
  isActive: r.isActive ?? true,
});

// sub-components
function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl px-3 py-3 gap-0.5">
      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">{label}</span>
      <span className="text-sm font-semibold text-slate-800 capitalize text-center leading-tight">{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-2.5">{children}</p>
  );
}

function Field({
  label, value, onChange, type = "text", textarea = false, span2 = false,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  span2?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1 ${span2 ? "col-span-2" : ""}`}>
      <span className="text-[10px] uppercase tracking-widest font-medium text-slate-400">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={2}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      )}
    </label>
  );
}

function StatusField({ value, onChange }: { value: Room["status"]; onChange: (v: Room["status"]) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest font-medium text-slate-400">Status</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value as Room["status"])}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
      >
        {statusOptions.map(s => (
          <option key={s} value={s}>{statusConfig[s].label}</option>
        ))}
      </select>
    </label>
  );
}

function Toggle({
  icon, label, checked, onChange,
}: { icon: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border font-medium transition ${
        checked
          ? "bg-blue-50 border-blue-100 text-blue-700"
          : "bg-slate-50 border-slate-100 text-slate-300"
      }`}
    >
      <span className={checked ? "" : "opacity-40"}>{icon}</span>{label}
    </button>
  );
}

// carousel
function ImageCarousel({ images, roomNumber }: { images: string[]; roomNumber: string }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const total = images.length;

  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

  if (total === 0) {
    return (
      <div className="h-64 bg-slate-100 flex items-center justify-center flex-shrink-0">
        <span className="text-slate-300 text-sm">No images available</span>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-64 flex-shrink-0 bg-black overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt={`Room ${roomNumber} — image ${current + 1}`}
            className="w-full h-full object-cover cursor-zoom-in"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(true)}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white/80 text-[10px] px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition pointer-events-none">
          Click to expand
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-xs font-medium">
              {current + 1} / {total}
            </p>

            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={images[current]}
                alt=""
                className="max-w-5xl max-h-[80vh] w-full object-contain px-16"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                onClick={e => e.stopPropagation()}
              />
            </AnimatePresence>

            {total > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={e => { e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {total > 1 && (
              <div className="absolute bottom-6 flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); setCurrent(i); }}
                    className={`w-12 h-9 rounded-md overflow-hidden border-2 transition ${
                      i === current ? "border-blue-400 opacity-100" : "border-transparent opacity-40 hover:opacity-70"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// main component
export const RoomDetailModal = ({ room, isOpen, onClose, onRoomUpdated }: RoomDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EditFormState | null>(null);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { toast, showToast, clearToast } = useToast();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // reset edit state whenever the modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setFormData(null);
      setNewImageFiles([]);
      clearToast();
    }
  }, [isOpen]);

  // generate/revoke object URLs for newly picked image previews
  useEffect(() => {
    const urls = newImageFiles.map(f => URL.createObjectURL(f));
    setNewImagePreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [newImageFiles]);

  if (!room) return null;

  const images = room.roomImages ?? [];
  const status = statusConfig[room.status] ?? { label: room.status, cls: "bg-slate-500/90 text-white" };

  const discountedPrice =
    room.discount > 0 ? room.pricePerNight * (1 - room.discount / 100) : null;

  const enabledFeatures  = boolFeatures.filter(f => (room as any)[f.key]);
  const disabledFeatures = boolFeatures.filter(f => !(room as any)[f.key]);

  const enterEditMode = () => {
    setFormData(initFormData(room));
    setIsEditing(true);
    clearToast();
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData(null);
    setNewImageFiles([]);
    clearToast();
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImageFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
    e.target.value = "";
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    clearToast();

    try {
      const infoPayload = {
        roomNumber: formData.roomNumber,
        status: formData.status,
        roomType: formData.roomType,
        suitetype: formData.suitetype,
        viewType: formData.viewType,
        bedType: formData.bedType,
        floorNumber: formData.floorNumber,
        capacity: formData.capacity,
        maxOccupancy: formData.maxOccupancy,
        roomSize: formData.roomSize,
        basePrice: formData.basePrice,
        pricePerNight: formData.pricePerNight,
        weekendPrice: formData.weekendPrice,
        taxRate: formData.taxRate,
        minStayNights: formData.minStayNights,
        discount: formData.discount,
        roomDescription: formData.roomDescription,
        cancellationPolicy: formData.cancellationPolicy,
        amenities: formData.amenitiesText.split(",").map(s => s.trim()).filter(Boolean),
        specialFeatures: formData.specialFeaturesText.split(",").map(s => s.trim()).filter(Boolean),
        hasWifi: formData.hasWifi,
        hasAC: formData.hasAC,
        hasBalcony: formData.hasBalcony,
        hasBathtub: formData.hasBathtub,
        hasShower: formData.hasShower,
        hasHeating: formData.hasHeating,
        isAccessible: formData.isAccessible,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
      };

      const infoRes = await updateRoomInfo(room._id, infoPayload);
      let updatedRoom: Room = infoRes?.data?.roomData ?? room;

      if (newImageFiles.length > 0) {
        const fd = new FormData();
        newImageFiles.forEach(file => fd.append("images", file));
        const imgRes = await updateRoomImages(room._id, fd);
        updatedRoom = imgRes?.data?.roomData ?? updatedRoom;
      }

      onRoomUpdated?.(updatedRoom);
      setIsEditing(false);
      setFormData(null);
      setNewImageFiles([]);
      showToast("success", "Room updated successfully.");
    } catch (err: any) {
      console.error("Failed to update room:", err);
      showToast("error", err?.response?.data?.message || "Failed to update room. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isSaving ? undefined : onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-hidden pointer-events-auto flex flex-col"
              onClick={e => e.stopPropagation()}
            >

              {/* Toast — sits above the carousel/body so scroll never clips it */}
              <div className="relative h-0 z-[70]">
                <Toast toast={toast} />
              </div>

              <div className="relative flex-shrink-0">
                <ImageCarousel images={images} roomNumber={room.roomNumber} />

                <span className={`absolute top-3 left-3 text-[11px] px-2.5 py-1 rounded-full font-semibold tracking-wide z-10 ${status.cls}`}>
                  {status.label}
                </span>

                {room.isFeatured && (
                  <span className="absolute top-3 left-24 text-[10px] px-2 py-1 rounded-full bg-yellow-400 text-yellow-900 font-bold z-10">
                    ★ Featured
                  </span>
                )}

                <button
                  onClick={onClose}
                  disabled={isSaving}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-sm disabled:opacity-40"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-5 py-5">
                <AnimatePresence mode="wait">
                  {!isEditing ? (
                    <motion.div
                      key="view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <h2 className="text-xl font-bold text-slate-900">Room {room.roomNumber}</h2>
                            {room.rating > 0 && (
                              <span className="flex items-center gap-1 text-xs text-slate-500">
                                <span className="text-yellow-400">★</span>
                                {room.rating.toFixed(1)}
                                {room.numberOfReviews ? (
                                  <span className="text-slate-400">({room.numberOfReviews})</span>
                                ) : null}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 capitalize">
                            {room.roomType}
                            {room.suitetype && room.suitetype !== "N/A" ? ` · ${room.suitetype}` : ""}
                            {room.viewType && room.viewType !== "none" ? ` · ${room.viewType} view` : ""}
                          </p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          {discountedPrice ? (
                            <>
                              <div className="flex items-baseline gap-1.5 justify-end">
                                <span className="text-lg font-bold text-slate-900">
                                  Rs. {Math.round(discountedPrice).toLocaleString()}
                                </span>
                                <span className="text-xs text-slate-400 line-through">
                                  Rs. {room.pricePerNight.toLocaleString()}
                                </span>
                              </div>
                              <span className="inline-block text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold mt-0.5">
                                {room.discount}% off
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-slate-900">
                              Rs. {room.pricePerNight.toLocaleString()}
                            </span>
                          )}
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            per night{room.taxRate ? ` · ${room.taxRate}% tax` : ""}
                          </p>
                          {room.weekendPrice && room.weekendPrice !== room.pricePerNight && (
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Weekend: Rs. {room.weekendPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>

                      {room.discount > 0 && (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-600 text-sm">🏷️</span>
                            <div>
                              <p className="text-xs font-semibold text-emerald-700">{room.discount}% discount applied</p>
                              <p className="text-[11px] text-emerald-500 mt-0.5">
                                You save Rs. {Math.round(room.pricePerNight * room.discount / 100).toLocaleString()} per night
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-emerald-500 line-through">Rs. {room.pricePerNight.toLocaleString()}</p>
                            <p className="text-sm font-bold text-emerald-700">Rs. {Math.round(discountedPrice!).toLocaleString()}</p>
                          </div>
                        </div>
                      )}

                      {room.roomDescription && (
                        <p className="text-sm text-slate-500 leading-relaxed border-l-2 border-blue-200 pl-3 italic">
                          {room.roomDescription}
                        </p>
                      )}

                      <div className="grid grid-cols-3 gap-2">
                        <StatCard label="Floor"    value={room.floorNumber} />
                        <StatCard label="Capacity" value={`${room.capacity} guests`} />
                        <StatCard label="Max occ." value={`${room.maxOccupancy ?? room.capacity} guests`} />
                        <StatCard label="Bed"      value={room.bedType ?? "—"} />
                        <StatCard label="Size"     value={room.roomSize ? `${room.roomSize} sq ft` : "—"} />
                        <StatCard label="Min stay" value={room.minStayNights ? `${room.minStayNights} night${room.minStayNights > 1 ? "s" : ""}` : "1 night"} />
                      </div>

                      <div>
                        <SectionTitle>Facilities</SectionTitle>
                        <div className="flex flex-wrap gap-1.5">
                          {enabledFeatures.map(({ key, icon, label }) => (
                            <span
                              key={key}
                              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium"
                            >
                              <span>{icon}</span>{label}
                            </span>
                          ))}
                          {disabledFeatures.map(({ key, icon, label }) => (
                            <span
                              key={key}
                              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-300 line-through"
                            >
                              <span className="opacity-40">{icon}</span>{label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {room.amenities && room.amenities.length > 0 && (
                        <div>
                          <SectionTitle>Amenities</SectionTitle>
                          <div className="flex flex-wrap gap-1.5">
                            {room.amenities.map((a, i) => (
                              <span key={i} className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full">
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {room.specialFeatures && room.specialFeatures.length > 0 && (
                        <div>
                          <SectionTitle>Special Features</SectionTitle>
                          <div className="flex flex-wrap gap-1.5">
                            {room.specialFeatures.map((f, i) => (
                              <span key={i} className="text-xs bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                                ✦ {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <SectionTitle>Details</SectionTitle>
                        <div className="bg-slate-50 rounded-xl divide-y divide-slate-100">
                          {room.cancellationPolicy && (
                            <div className="flex justify-between items-center px-4 py-2.5">
                              <span className="text-xs text-slate-400">Cancellation</span>
                              <span className="text-xs font-medium text-slate-700 text-right max-w-[55%]">{room.cancellationPolicy}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center px-4 py-2.5">
                            <span className="text-xs text-slate-400">Room ID</span>
                            <span className="font-mono text-[10px] text-slate-400">{room._id}</span>
                          </div>
                          {room.createdAt && (
                            <div className="flex justify-between items-center px-4 py-2.5">
                              <span className="text-xs text-slate-400">Added</span>
                              <span className="text-xs text-slate-600">
                                {new Date(room.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    formData && (
                      <motion.div
                        key="edit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-5"
                      >
                        <div>
                          <SectionTitle>Basic Info</SectionTitle>
                          <div className="grid grid-cols-2 gap-3">
                            <Field label="Room Number" value={formData.roomNumber}
                              onChange={v => setFormData(f => f && { ...f, roomNumber: v })} />
                            <StatusField value={formData.status}
                              onChange={v => setFormData(f => f && { ...f, status: v })} />
                            <Field label="Room Type" value={formData.roomType}
                              onChange={v => setFormData(f => f && { ...f, roomType: v })} />
                            <Field label="Suite Type" value={formData.suitetype}
                              onChange={v => setFormData(f => f && { ...f, suitetype: v })} />
                            <Field label="Bed Type" value={formData.bedType}
                              onChange={v => setFormData(f => f && { ...f, bedType: v })} />
                            <Field label="View Type" value={formData.viewType}
                              onChange={v => setFormData(f => f && { ...f, viewType: v })} />
                            <Field label="Room Description" value={formData.roomDescription}
                              onChange={v => setFormData(f => f && { ...f, roomDescription: v })}
                              textarea span2 />
                          </div>
                        </div>

                        <div>
                          <SectionTitle>Stats</SectionTitle>
                          <div className="grid grid-cols-3 gap-3">
                            <Field label="Floor" type="number" value={formData.floorNumber}
                              onChange={v => setFormData(f => f && { ...f, floorNumber: Number(v) || 0 })} />
                            <Field label="Capacity" type="number" value={formData.capacity}
                              onChange={v => setFormData(f => f && { ...f, capacity: Number(v) || 0 })} />
                            <Field label="Max Occupancy" type="number" value={formData.maxOccupancy}
                              onChange={v => setFormData(f => f && { ...f, maxOccupancy: Number(v) || 0 })} />
                            <Field label="Room Size (sq ft)" type="number" value={formData.roomSize}
                              onChange={v => setFormData(f => f && { ...f, roomSize: Number(v) || 0 })} />
                            <Field label="Min Stay Nights" type="number" value={formData.minStayNights}
                              onChange={v => setFormData(f => f && { ...f, minStayNights: Number(v) || 1 })} />
                          </div>
                        </div>

                        <div>
                          <SectionTitle>Pricing</SectionTitle>
                          <div className="grid grid-cols-3 gap-3">
                            <Field label="Base Price" type="number" value={formData.basePrice}
                              onChange={v => setFormData(f => f && { ...f, basePrice: Number(v) || 0 })} />
                            <Field label="Price / Night" type="number" value={formData.pricePerNight}
                              onChange={v => setFormData(f => f && { ...f, pricePerNight: Number(v) || 0 })} />
                            <Field label="Weekend Price" type="number" value={formData.weekendPrice}
                              onChange={v => setFormData(f => f && { ...f, weekendPrice: Number(v) || 0 })} />
                            <Field label="Tax Rate (%)" type="number" value={formData.taxRate}
                              onChange={v => setFormData(f => f && { ...f, taxRate: Number(v) || 0 })} />
                            <Field label="Discount (%)" type="number" value={formData.discount}
                              onChange={v => setFormData(f => f && { ...f, discount: Number(v) || 0 })} />
                          </div>
                        </div>

                        <div>
                          <SectionTitle>Amenities & Features</SectionTitle>
                          <div className="grid grid-cols-1 gap-3">
                            <Field label="Amenities (comma separated)" value={formData.amenitiesText}
                              onChange={v => setFormData(f => f && { ...f, amenitiesText: v })} />
                            <Field label="Special Features (comma separated)" value={formData.specialFeaturesText}
                              onChange={v => setFormData(f => f && { ...f, specialFeaturesText: v })} />
                            <Field label="Cancellation Policy" value={formData.cancellationPolicy}
                              onChange={v => setFormData(f => f && { ...f, cancellationPolicy: v })}
                              textarea />
                          </div>
                        </div>

                        <div>
                          <SectionTitle>Facilities</SectionTitle>
                          <div className="flex flex-wrap gap-1.5">
                            {boolFeatures.map(({ key, icon, label }) => (
                              <Toggle
                                key={key}
                                icon={icon}
                                label={label}
                                checked={formData[key as keyof EditFormState] as boolean}
                                onChange={v => setFormData(f => f && { ...f, [key]: v })}
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <SectionTitle>Photos</SectionTitle>
                          {images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {images.map((img, i) => (
                                <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          )}
                          {newImagePreviews.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {newImagePreviews.map((src, i) => (
                                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-blue-300">
                                  <img src={src} alt="" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => removeNewImage(i)}
                                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center text-[10px]"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <label className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-dashed border-slate-300 text-slate-500 hover:border-blue-300 hover:text-blue-600 cursor-pointer transition">
                            + Add Photos
                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFilesSelected} />
                          </label>
                          <p className="text-[10px] text-slate-400 mt-1">
                            New photos are added alongside existing ones — existing photos can't be removed from here yet.
                          </p>
                        </div>
                      </motion.div>
                    )
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-shrink-0 border-t border-slate-100 px-5 py-4 flex gap-3 bg-white">
                {!isEditing ? (
                  <>
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition font-medium"
                    >
                      Close
                    </button>
                    <button
                      onClick={enterEditMode}
                      className="flex-1 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
                    >
                      Manage Room
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={cancelEdit}
                      disabled={isSaving}
                      className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold disabled:opacity-60"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                )}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};