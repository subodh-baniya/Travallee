import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHotel,
  FaUser,
  FaMapMarkerAlt,
  FaBuilding,
  FaPhoneAlt,
  FaMoneyBillWave,
  FaClock,
  FaWifi,
  FaImage,
  FaFileAlt,
  FaSave,
} from "react-icons/fa";

interface HotelForm {
  ownerName: string;
  hotelName: string;
  hotelDescription: string;
  hotelLocation: string;
  propertyType: string;
  contactNumber: string;
  checkinTime: string;
  checkoutTime: string;
  pricePerNight: number;
  facilities: string;
  isactive: boolean;
  isFeatured: boolean;
}

const RegisterHotel = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<HotelForm>({
    ownerName: "",
    hotelName: "",
    hotelDescription: "",
    hotelLocation: "",
    propertyType: "",
    contactNumber: "",
    checkinTime: "14:00",
    checkoutTime: "12:00",
    pricePerNight: 0,
    facilities: "",
    isactive: true,
    isFeatured: false,
  });

  const [hotelImages, setHotelImages] = useState<FileList | null>(null);
  const [docs, setDocs] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "pricePerNight" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "facilities") {
          fd.append(
            "facilities",
            JSON.stringify(
              (value as string)
                .split(",")
                .map((f: string) => f.trim())
                .filter(Boolean)
            )
          );
        } else {
          fd.append(key, String(value));
        }
      });

      if (hotelImages) {
        Array.from(hotelImages).forEach((file) => {
          fd.append("hotelImages", file);
        });
      }

      if (docs) {
        Array.from(docs).forEach((file) => {
          fd.append("VerificationDocuments", file);
        });
      }

     await axios.post(
        `${import.meta.env.VITE_API_BASE_URL_HOTEL}/register`,
        fd
      );
      
      navigate("/login");
    } catch (error) {
      console.error("Failed to register hotel:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const inputClass =
    "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white";
  const inputWithIconClass =
    "w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white";
  const labelClass = "text-xs font-medium text-slate-500 mb-2 block";
  const iconClass = "absolute top-3.5 left-4 text-slate-400 text-sm";

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <motion.div
        className="max-w-4xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* HEADER */}
        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-2">
              <FaHotel />
              New Registration
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Register Hotel</h1>
            <p className="text-sm text-slate-500 mt-1">
              Add a new property to the booking system. Fill out the details below.
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <FaSave />
            {isSubmitting ? "Registering..." : "Register Hotel"}
          </button>
        </motion.div>

        {/* BASIC INFORMATION */}
        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Hotel Name</label>
              <div className="relative">
                <FaHotel className={iconClass} />
                <input name="hotelName" value={form.hotelName} onChange={handleChange} className={inputWithIconClass} placeholder="e.g. Grand Plaza Hotel" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Owner Name</label>
              <div className="relative">
                <FaUser className={iconClass} />
                <input name="ownerName" value={form.ownerName} onChange={handleChange} className={inputWithIconClass} placeholder="e.g. John Doe" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                name="hotelDescription"
                value={form.hotelDescription}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
                rows={4}
                placeholder="Describe the hotel, its vibe, and key attractions..."
              />
            </div>
          </div>
        </motion.div>

        {/* LOCATION & PROPERTY */}
        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Location & Property</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Location</label>
              <div className="relative">
                <FaMapMarkerAlt className={iconClass} />
                <input name="hotelLocation" value={form.hotelLocation} onChange={handleChange} className={inputWithIconClass} placeholder="e.g. 123 Main St, City" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Property Type</label>
              <div className="relative">
                <FaBuilding className={iconClass} />
                <input name="propertyType" value={form.propertyType} onChange={handleChange} className={inputWithIconClass} placeholder="e.g. Resort, Boutique" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Contact Number</label>
              <div className="relative">
                <FaPhoneAlt className={iconClass} />
                <input name="contactNumber" value={form.contactNumber} onChange={handleChange} className={inputWithIconClass} placeholder="e.g. +1 234 567 8900" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Price per Night (Rs.)</label>
              <div className="relative">
                <FaMoneyBillWave className={iconClass} />
                <input type="number" name="pricePerNight" value={form.pricePerNight} onChange={handleChange} className={inputWithIconClass} placeholder="0" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* TIMING & FACILITIES */}
        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Timing & Facilities</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Check-in Time</label>
              <div className="relative">
                <FaClock className={iconClass} />
                <input type="time" name="checkinTime" value={form.checkinTime} onChange={handleChange} className={inputWithIconClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Check-out Time</label>
              <div className="relative">
                <FaClock className={iconClass} />
                <input type="time" name="checkoutTime" value={form.checkoutTime} onChange={handleChange} className={inputWithIconClass} />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Facilities</label>
              <div className="relative">
                <FaWifi className={iconClass} />
                <input name="facilities" value={form.facilities} onChange={handleChange} className={inputWithIconClass} placeholder="WiFi, Parking, Swimming Pool, Gym (Comma separated)" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* MEDIA & DOCUMENTS */}
        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Media & Documents</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Hotel Images</label>
              <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
                <FaImage className="text-slate-400 text-2xl mb-2" />
                <p className="text-xs text-slate-500 mb-2">Upload high-quality images of the property</p>
                <input type="file" multiple onChange={(e) => setHotelImages(e.target.files)} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Verification Documents</label>
              <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
                <FaFileAlt className="text-slate-400 text-2xl mb-2" />
                <p className="text-xs text-slate-500 mb-2">Upload legal documents and ID proofs</p>
                <input type="file" multiple onChange={(e) => setDocs(e.target.files)} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* STATUS */}
        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Status</h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${form.isactive ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                {form.isactive && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input type="checkbox" className="hidden" checked={form.isactive} onChange={(e) => setForm(p => ({ ...p, isactive: e.target.checked }))} />
              <span className="text-sm font-medium text-slate-700">Active Listing</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${form.isFeatured ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                {form.isFeatured && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <input type="checkbox" className="hidden" checked={form.isFeatured} onChange={(e) => setForm(p => ({ ...p, isFeatured: e.target.checked }))} />
              <span className="text-sm font-medium text-slate-700">Featured Property</span>
            </label>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default RegisterHotel;