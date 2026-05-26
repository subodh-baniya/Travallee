import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toast } from "./Toast";

type RoomStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
type ViewType =
  | "city"
  | "garden"
  | "beach"
  | "mountain"
  | "street"
  | "pool"
  | "none";

interface AddRoomFormData {
  roomNumber: string;
  roomType: "STANDARD" | "DELUXE" | "SUITE";
  status: RoomStatus;
  suitetype: string;

  roomDescription: string;

  maxOccupancy: number | "";
  capacity: number | "";
  roomSize: number | "";
  bedType: string;
  floorNumber: number | "";

  viewType: ViewType;

  basePrice: number | "";
  pricePerNight: number | "";
  weekendPrice: number | "";

  taxRate: number;

  minStayNights: number;

  cancellationPolicy: string;

  amenities: string[];
  specialFeatures: string[];

  roomImages: File[];

  isAccessible: boolean;
  hasBathtub: boolean;
  hasShower: boolean;
  hasBalcony: boolean;
  hasAC: boolean;
  hasHeating: boolean;
  hasWifi: boolean;

  isActive: boolean;
  isFeatured: boolean;

  rating: number;
  numberOfReviews: number;
  discount: number | "";
}

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void> | void;
}

const AMENITY_OPTIONS = [
  "WiFi", "AC", "TV", "Mini Bar", "Safe", "Bathtub",
  "Shower", "Balcony", "Sea View", "King Bed", "Twin Bed",
  "Sofa", "Kitchenette", "Room Service", "Jacuzzi",
];

const SUITE_TYPES = ["Junior Suite", "Executive Suite", "Presidential Suite", "Penthouse", "N/A"];

const initialForm: AddRoomFormData = {
  roomNumber: "",
  roomType: "STANDARD",
  suitetype: "N/A",

  status: "AVAILABLE",

  roomDescription: "",

  maxOccupancy: "",
  capacity: "",
  roomSize: "",

  bedType: "",
  floorNumber: "",

  viewType: "none",

  basePrice: "",
  pricePerNight: "",
  weekendPrice: "",

  taxRate: 0,
  minStayNights: 1,

  cancellationPolicy: "",

  amenities: [],
  specialFeatures: [],

  roomImages: [],

  isAccessible: false,
  hasBathtub: false,
  hasShower: false,
  hasBalcony: false,
  hasAC: true,
  hasHeating: false,
  hasWifi: true,

  isActive: true,
  isFeatured: false,

  rating: 0,
  numberOfReviews: 0,
  discount: "",
};

const steps = ["Basic Info", "Pricing & Capacity", "Amenities", "Images"];

const statusStyles: Record<RoomStatus, string> = {
  AVAILABLE: "bg-emerald-50 border-emerald-300 text-emerald-700",
  OCCUPIED: "bg-blue-50 border-blue-300 text-blue-700",
  MAINTENANCE: "bg-rose-50 border-rose-300 text-rose-700",
};

export const AddRoomModal = ({ isOpen, onClose, onSubmit }: AddRoomModalProps) => {
  const [form, setForm] = useState<AddRoomFormData>(initialForm);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AddRoomFormData, string>>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast, showToast, clearToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: keyof AddRoomFormData, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const toggleAmenity = (a: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter(x => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFiles = files.filter(
      f => !form.roomImages.some(existing => existing.name === f.name && existing.size === f.size)
    );

    if (newFiles.length === 0) return;

    // Generate preview URLs
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews(prev => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    update("roomImages", [...form.roomImages, ...newFiles]);

    // Reset input so same file can be re-selected if removed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    update("roomImages", form.roomImages.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const validateStep = () => {
    const errs: typeof errors = {};
    if (step === 0) {
      if (!form.roomNumber.trim()) errs.roomNumber = "Room number is required";
      if (!form.roomType) errs.roomType = "Room type is required";
      if (!form.floorNumber && form.floorNumber !== 0) errs.floorNumber = "Floor number is required";
      if (!form.roomDescription.trim()) errs.roomDescription = "Room description is required";
      if (!form.bedType) errs.bedType = "Bed type is required";
    }
    if (step === 1) {
      if (!form.pricePerNight) errs.pricePerNight = "Price per night is required";
      if (!form.capacity) errs.capacity = "Capacity is required";
      if (!form.maxOccupancy) errs.maxOccupancy = "Max occupancy is required";
      if (!form.cancellationPolicy) errs.cancellationPolicy = "Cancellation policy is required";
    }
    if (step === 2) {
      if (form.amenities.length === 0) errs.amenities = "Select at least one amenity";
    }
    if (step === 3) {
      if (form.roomImages.length === 0) {
        showToast('error', "Please upload at least one room image before submitting.");
        return false;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(s => Math.min(steps.length - 1, s + 1));
  };

  const handleBack = () => setStep(s => Math.max(0, s - 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("roomNumber", form.roomNumber);
      formData.append("roomType", form.roomType);
      formData.append("status", form.status);
      formData.append("suitetype", form.suitetype);

      formData.append("roomDescription", form.roomDescription);

      formData.append("maxOccupancy", String(form.maxOccupancy));
      formData.append("capacity", String(form.capacity));
      if (form.roomSize && Number(form.roomSize) > 0) {
        formData.append("roomSize", String(form.roomSize));
      }

      formData.append("bedType", form.bedType);
      formData.append("floorNumber", String(form.floorNumber));

      formData.append("viewType", form.viewType);

      formData.append("basePrice", String(form.pricePerNight));
      formData.append("pricePerNight", String(form.pricePerNight));
      if (form.weekendPrice && Number(form.weekendPrice) > 0) {
        formData.append("weekendPrice", String(form.weekendPrice));
      }

      formData.append("taxRate", String(form.taxRate));
      formData.append("minStayNights", String(form.minStayNights));

      formData.append("cancellationPolicy", form.cancellationPolicy);

      formData.append("amenities", form.amenities.join(","));
      if (form.specialFeatures.length > 0) {
        formData.append("specialFeatures", form.specialFeatures.join(","));
      }

      formData.append("isAccessible", String(form.isAccessible));
      formData.append("hasBathtub", String(form.hasBathtub));
      formData.append("hasShower", String(form.hasShower));
      formData.append("hasBalcony", String(form.hasBalcony));
      formData.append("hasAC", String(form.hasAC));
      formData.append("hasHeating", String(form.hasHeating));
      formData.append("hasWifi", String(form.hasWifi));

      formData.append("discount", String(form.discount || 0));

      form.roomImages.forEach(file => {
        formData.append("roomImages", file);
      });

      await onSubmit(formData);
      showToast('success', "Room added successfully!");

      setTimeout(() => {
        setForm(initialForm);
        setImagePreviews([]);
        setStep(0);
        clearToast();
        onClose();
      }, 1500);

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      const validationErrors = error.response?.data?.errors || error.response?.data?.data || [];
      console.error("Backend validation error:", error.response?.data);
      showToast('error', `Failed to add room: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const resetAndClose = () => {
    setForm(initialForm);
    setImagePreviews([]);
    setStep(0);
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
          style={{ backgroundColor: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(4px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
            style={{ maxHeight: "90vh" }}
          >
            {/* TOAST NOTIFICATION */}
            <Toast toast={toast} />

            {/* HEADER */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Add New Room</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Step {step + 1} of {steps.length} — {steps[step]}</p>
                </div>
                <button
                  onClick={resetAndClose}
                  className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* STEPPER */}
              <div className="flex items-center gap-1 mt-4">
                {steps.map((s, i) => (
                  <div key={s} className="flex items-center flex-1">
                    <div
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-blue-500" : "bg-slate-100"
                        }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* BODY */}
            <div className="overflow-y-auto px-6 py-5 space-y-4" style={{ maxHeight: "calc(90vh - 180px)" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                >

                  {/* STEP 0 — Basic Info */}
                  {step === 0 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">Room Number *</label>
                        <input
                          type="text"
                          value={form.roomNumber}
                          onChange={e => update("roomNumber", e.target.value)}
                          placeholder="e.g. 101, A-202"
                          className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50 ${errors.roomNumber ? "border-rose-300 bg-rose-50" : "border-slate-200"
                            }`}
                        />
                        {errors.roomNumber && <p className="text-xs text-rose-500 mt-1">{errors.roomNumber}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">Room Type *</label>
                          <select
                            value={form.roomType}
                            onChange={e => update("roomType", e.target.value as RoomType)}
                            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 bg-white"
                          >
                            <option value="STANDARD">Standard</option>
                            <option value="DELUXE">Deluxe</option>
                            <option value="SUITE">Suite</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">Floor Number *</label>
                          <input
                            type="number"
                            value={form.floorNumber}
                            onChange={e => update("floorNumber", e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder="e.g. 1"
                            min={0}
                            className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50 ${errors.floorNumber ? "border-rose-300 bg-rose-50" : "border-slate-200"
                              }`}
                          />
                          {errors.floorNumber && <p className="text-xs text-rose-500 mt-1">{errors.floorNumber}</p>}
                        </div>
                      </div>

                      {form.roomType === "SUITE" && (
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">Suite Type</label>
                          <select
                            value={form.suitetype}
                            onChange={e => update("suitetype", e.target.value)}
                            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 bg-white"
                          >
                            {SUITE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-2">Status</label>
                        <div className="flex gap-2">
                          {(["AVAILABLE", "OCCUPIED", "MAINTENANCE"] as RoomStatus[]).map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => update("status", s)}
                              className={`flex-1 py-2 text-xs rounded-xl border transition font-medium ${form.status === s
                                  ? statusStyles[s]
                                  : "border-slate-200 text-slate-400 hover:bg-slate-50"
                                }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">Description *</label>
                        <textarea
                          value={form.roomDescription}
                          onChange={e => update("roomDescription", e.target.value)}
                          placeholder="Brief description of the room..."
                          rows={3}
                          className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none focus:border-blue-400 resize-none ${errors.roomDescription ? "border-rose-300 bg-rose-50" : "border-slate-200"
                            }`}
                        />
                        {errors.roomDescription && <p className="text-xs text-rose-500 mt-1">{errors.roomDescription}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">Bed Type *</label>
                          <select
                            value={form.bedType}
                            onChange={e => update("bedType", e.target.value)}
                            className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none focus:border-blue-400 bg-white ${errors.bedType ? "border-rose-300 bg-rose-50" : "border-slate-200"
                              }`}
                          >
                            <option value="">Select bed type</option>
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Queen">Queen</option>
                            <option value="King">King</option>
                            <option value="Twin">Twin</option>
                            <option value="Bunk">Bunk</option>
                          </select>
                          {errors.bedType && <p className="text-xs text-rose-500 mt-1">{errors.bedType}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">View Type</label>
                          <select
                            value={form.viewType}
                            onChange={e => update("viewType", e.target.value)}
                            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400 bg-white"
                          >
                            <option value="none">None</option>
                            <option value="city">City</option>
                            <option value="garden">Garden</option>
                            <option value="beach">Beach</option>
                            <option value="mountain">Mountain</option>
                            <option value="street">Street</option>
                            <option value="pool">Pool</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 1 — Pricing & Capacity */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">Price per Night (Rs.) *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">Rs.</span>
                          <input
                            type="number"
                            value={form.pricePerNight}
                            onChange={e => update("pricePerNight", e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder="0"
                            min={0}
                            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50 ${errors.pricePerNight ? "border-rose-300 bg-rose-50" : "border-slate-200"
                              }`}
                          />
                        </div>
                        {errors.pricePerNight && <p className="text-xs text-rose-500 mt-1">{errors.pricePerNight}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">Capacity (guests) *</label>
                        <input
                          type="number"
                          value={form.capacity}
                          onChange={e => update("capacity", e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="e.g. 2"
                          min={1}
                          max={20}
                          className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50 ${errors.capacity ? "border-rose-300 bg-rose-50" : "border-slate-200"
                            }`}
                        />
                        {errors.capacity && <p className="text-xs text-rose-500 mt-1">{errors.capacity}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">Max Occupancy *</label>
                          <input
                            type="number"
                            value={form.maxOccupancy}
                            onChange={e => update("maxOccupancy", e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder="e.g. 4"
                            min={1}
                            className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50 ${errors.maxOccupancy ? "border-rose-300 bg-rose-50" : "border-slate-200"
                              }`}
                          />
                          {errors.maxOccupancy && <p className="text-xs text-rose-500 mt-1">{errors.maxOccupancy}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">
                            Room Size (sq ft)
                            <span className="ml-1 text-slate-400 font-normal">optional</span>
                          </label>
                          <input
                            type="number"
                            value={form.roomSize}
                            onChange={e => update("roomSize", e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder="e.g. 350"
                            min={1}
                            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400"
                          />
                        </div>
                      </div>



                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">Cancellation Policy *</label>
                        <select
                          value={form.cancellationPolicy}
                          onChange={e => update("cancellationPolicy", e.target.value)}
                          className={`w-full px-3 py-2.5 text-sm border rounded-xl outline-none focus:border-blue-400 bg-white ${errors.cancellationPolicy ? "border-rose-300 bg-rose-50" : "border-slate-200"
                            }`}
                        >
                          <option value="">Select policy</option>
                          <option value="Free cancellation up to 24 hours">Free cancellation up to 24 hours</option>
                          <option value="Free cancellation up to 48 hours">Free cancellation up to 48 hours</option>
                          <option value="Non-refundable">Non-refundable</option>
                          <option value="Flexible">Flexible</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Strict">Strict</option>
                        </select>
                        {errors.cancellationPolicy && <p className="text-xs text-rose-500 mt-1">{errors.cancellationPolicy}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                          Discount (%)
                          <span className="ml-1 text-slate-400 font-normal">optional</span>
                        </label>
                        <input
                          type="number"
                          value={form.discount}
                          onChange={e => update("discount", e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="0"
                          min={0}
                          max={100}
                          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-400"
                        />
                      </div>

                      {/* Summary card */}
                      {form.pricePerNight !== "" && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                          <p className="text-xs text-blue-500 font-medium mb-2">Price Preview</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Base price</span>
                            <span className="text-sm font-semibold text-slate-900">
                              Rs. {Number(form.pricePerNight).toLocaleString()}
                            </span>
                          </div>
                          {Number(form.discount) > 0 && (
                            <>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-sm text-emerald-600">Discount ({form.discount}%)</span>
                                <span className="text-sm text-emerald-600">
                                  − Rs. {(Number(form.pricePerNight) * Number(form.discount) / 100).toLocaleString()}
                                </span>
                              </div>
                              <div className="border-t border-blue-100 mt-2 pt-2 flex justify-between">
                                <span className="text-sm font-medium text-slate-700">Final price</span>
                                <span className="text-sm font-bold text-blue-700">
                                  Rs. {(Number(form.pricePerNight) * (1 - Number(form.discount) / 100)).toLocaleString()}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 2 — Amenities */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500">Select amenities available in this room</p>
                      <div className="flex flex-wrap gap-2">
                        {AMENITY_OPTIONS.map(a => {
                          const selected = form.amenities.includes(a);
                          return (
                            <button
                              key={a}
                              type="button"
                              onClick={() => toggleAmenity(a)}
                              className={`px-3 py-1.5 text-xs rounded-full border transition font-medium ${selected
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                                }`}
                            >
                              {selected && <span className="mr-1">✓</span>}
                              {a}
                            </button>
                          );
                        })}
                      </div>
                      {errors.amenities && <p className="text-xs text-rose-500 mt-1">{errors.amenities}</p>}

                      {form.amenities.length > 0 && (
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                          <p className="text-[11px] text-slate-400 mb-2">Selected ({form.amenities.length})</p>
                          <div className="flex flex-wrap gap-1">
                            {form.amenities.map(a => (
                              <span key={a} className="text-[11px] bg-blue-50 border border-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 3 — Images */}
                  {step === 3 && (
                    <div className="space-y-4">
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      {/* Drop zone / trigger */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-slate-200 rounded-xl py-8 flex flex-col items-center gap-2 text-slate-400 hover:border-blue-300 hover:bg-blue-50/40 transition group"
                      >
                        <svg
                          className="w-8 h-8 opacity-40 group-hover:opacity-70 transition"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div className="text-center">
                          <p className="text-xs font-medium text-slate-500 group-hover:text-blue-500 transition">
                            Click to upload images
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, WEBP — multiple allowed</p>
                        </div>
                      </button>

                      {form.roomImages.length > 0 && (
                        <>
                          <p className="text-[11px] text-slate-400">
                            {form.roomImages.length} image{form.roomImages.length > 1 ? "s" : ""} selected — first is the cover
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            {imagePreviews.map((preview, idx) => (
                              <div
                                key={idx}
                                className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video"
                              >
                                <img
                                  src={preview}
                                  alt={`Room image ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                {idx === 0 && (
                                  <span className="absolute top-1.5 left-1.5 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                                    Cover
                                  </span>
                                )}
                                {/* File name tooltip */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                                  <p className="text-[10px] text-white truncate">
                                    {form.roomImages[idx]?.name}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage(idx)}
                                  className="absolute top-1.5 right-1.5 bg-white/90 text-rose-500 rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition hover:bg-rose-50"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}

                            {/* Add more button */}
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="aspect-video rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-blue-300 hover:bg-blue-50/40 transition"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              <span className="text-[11px]">Add more</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/60">
              <button
                onClick={step === 0 ? resetAndClose : handleBack}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-white transition"
              >
                {step === 0 ? "Cancel" : "Back"}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">{step + 1} / {steps.length}</span>
                {step < steps.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-5 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 disabled:opacity-60 transition flex items-center gap-2"
                  >
                    {submitting && (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    {submitting ? "Adding..." : "Add Room"}
                  </button>
                )}
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddRoomModal;