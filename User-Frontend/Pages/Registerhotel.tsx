import { useState } from "react";
import { registerHotel } from "../Services/hotel.api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../Contexts/Authcontext";
import  { AxiosError } from "axios";
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
  FaPaperPlane,
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
}

const RegisterHotel = () => {
  const navigate = useNavigate();

   const auth = useAuth();
    if (!auth) {
      throw new Error("useAuth must be used within AuthProvider");
    }

  const { refreshUser } = auth;
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

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const fd = new FormData();
    const contactNumber = form.contactNumber.replace(/\D/g, "");

    fd.append("ownerName", form.ownerName.trim());
    fd.append("hotelName", form.hotelName.trim());
    fd.append("hotelDescription", form.hotelDescription.trim());
    fd.append("hotelLocation", form.hotelLocation.trim());
    fd.append("propertyType", form.propertyType.trim());
    fd.append("contactNumber", contactNumber);
    fd.append("checkinTime", form.checkinTime);
    fd.append("checkoutTime", form.checkoutTime);
    fd.append("pricePerNight", String(form.pricePerNight));
    fd.append("verified", "false");
    fd.append("rating", "0");
    fd.append("numberOfReviews", "0");

    const facilitiesArray = form.facilities
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    if (facilitiesArray.length === 0) {
      alert("Please enter at least one facility.");
      return;
    }
    fd.append("facilities", facilitiesArray.join(","));

    if (!hotelImages || hotelImages.length === 0) {
      alert("Please upload at least one hotel image.");
      return;
    }
    Array.from(hotelImages).forEach((file) => fd.append("hotelImages", file));

    if (!docs || docs.length === 0) {
      alert("Please upload at least one verification document.");
      return;
    }
    Array.from(docs).forEach((file) => fd.append("VerificationDocuments", file));

    await registerHotel(fd);
    await refreshUser();
    navigate("/dashboard");
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Failed:", error);
    console.error("Validation issues:", axiosError?.response?.data); // shows exact Zod errors from backend
    alert("Registration failed. Please check all fields and try again");
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
  const facilitiesList = form.facilities
    .split(",")
    .map((facility) => facility.trim())
    .filter(Boolean);
  const isFormComplete =
    form.ownerName.trim().length > 0 &&
    form.hotelName.trim().length > 0 &&
    form.hotelDescription.trim().length > 0 &&
    form.hotelLocation.trim().length > 0 &&
    form.propertyType.trim().length > 0 &&
    form.checkinTime.trim().length > 0 &&
    form.checkoutTime.trim().length > 0 &&
    form.pricePerNight > 0 &&
    form.contactNumber.replace(/\D/g, "").length >= 10 &&
    facilitiesList.length > 0 &&
    Boolean(hotelImages?.length) &&
    Boolean(docs?.length);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <motion.form
        onSubmit={handleSubmit}
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
                <input
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={handleChange}
                  className={inputWithIconClass}
                  placeholder="e.g. 9779841234567"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
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
                <input type="file" multiple accept="image/*" onChange={(e) => setHotelImages(e.target.files)} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Verification Documents</label>
              <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
                <FaFileAlt className="text-slate-400 text-2xl mb-2" />
                <p className="text-xs text-slate-500 mb-2">Upload legal documents and ID proofs</p>
                <input type="file" multiple accept="application/pdf,image/*" onChange={(e) => setDocs(e.target.files)} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <button
            type="submit"
            disabled={isSubmitting || !isFormComplete}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <FaPaperPlane />
            {isSubmitting ? "Sending..." : isFormComplete ? "Submit Registration" : "Fill all fields to submit"}
          </button>
        </motion.div>

      </motion.form>
    </div>
  );
};

export default RegisterHotel;