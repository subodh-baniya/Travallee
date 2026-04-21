import React, { useState, useEffect } from 'react';
import axios from 'axios';

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */
interface Staff {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

interface HotelDetails {
  ownerName: string;
  hotelName: string;
  hotelDescription: string;
  hotelLocation: string;
  hotelImages: string[];
  propertyType: string;
  verified: boolean;
  VerificationDocuments: string[];
  contactNumber: string;
  isactive: boolean;
  facilities: string[];
  checkinTime: string;
  checkoutTime: string;
  pricePerNight: number;
  rating: number;
  numberOfReviews: number;
  isFeatured: boolean;
  staff: Staff[];
}

/* ─────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────── */
const BLANK_STAFF: Staff = {
  id: '',
  name: '',
  position: '',
  email: '',
  phone: '',
  joinDate: new Date().toISOString().split('T')[0],
  status: 'active',
};

const DEFAULT_HOTEL: HotelDetails = {
  ownerName: 'Prabin Karki',
  hotelName: 'Travalle Boutique Hotel',
  hotelDescription:
    'A cozy boutique hotel near the city center with panoramic mountain views, artisanal breakfasts, and curated local experiences that capture the soul of Pokhara.',
  hotelLocation: 'Lakeside, Pokhara, Nepal',
  hotelImages: [
    'https://example.com/images/hotel-front.jpg',
    'https://example.com/images/lobby.jpg',
  ],
  propertyType: 'Boutique Hotel',
  verified: false,
  VerificationDocuments: ['https://example.com/docs/business-license.pdf'],
  contactNumber: '9812345678',
  isactive: true,
  facilities: ['Free WiFi', 'Parking', 'Breakfast', 'Room Service', 'Gym', 'Spa'],
  checkinTime: '14:00',
  checkoutTime: '12:00',
  pricePerNight: 85,
  rating: 4.3,
  numberOfReviews: 127,
  isFeatured: true,
  staff: [
    { id: '1', name: 'John Smith',    position: 'Manager',      email: 'john@hotel.com',  phone: '9812345601', joinDate: '2023-01-15', status: 'active'   },
    { id: '2', name: 'Sarah Johnson', position: 'Receptionist', email: 'sarah@hotel.com', phone: '9812345602', joinDate: '2023-06-20', status: 'active'   },
    { id: '3', name: 'Mike Chen',     position: 'Head Chef',    email: 'mike@hotel.com',  phone: '9812345603', joinDate: '2023-03-10', status: 'inactive' },
  ],
};

/* ─────────────────────────────────────────────────────────
   Shared class strings
───────────────────────────────────────────────────────── */
const inputCls =
  'w-full px-3.5 py-2.5 bg-amber-50/60 border border-stone-200 rounded-lg text-stone-800 text-sm font-medium placeholder-stone-300 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20';

const labelCls =
  'block text-[10px] font-bold tracking-[1.5px] uppercase text-amber-700 mb-1.5';

/* ─────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────── */
const initials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex gap-1 mt-1.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <svg
        key={n}
        className={`w-4 h-4 ${n <= Math.round(rating) ? 'text-amber-500' : 'text-stone-200'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

/* Card */
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white border border-stone-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
    {children}
  </div>
);

/* Card title row */
const CardTitle: React.FC<{ icon: string; children: React.ReactNode; badge?: React.ReactNode }> = ({ icon, children, badge }) => (
  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-stone-100">
    <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-sm shrink-0">{icon}</span>
    <h3 className="font-serif text-xl font-semibold text-stone-800 tracking-tight leading-none">{children}</h3>
    {badge && <span className="ml-auto">{badge}</span>}
  </div>
);

/* ─────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────── */
const HotelSettingsPage: React.FC = () => {
  const [isEditing, setIsEditing]             = useState(false);
  const [hotelDetails, setHotelDetails]       = useState<HotelDetails>(DEFAULT_HOTEL);
  const [formData, setFormData]               = useState<HotelDetails>(DEFAULT_HOTEL);
  const [facilitiesInput, setFacilitiesInput] = useState(DEFAULT_HOTEL.facilities.join(', '));
  const [imageInput, setImageInput]           = useState(DEFAULT_HOTEL.hotelImages.join('\n'));
  const [staffList, setStaffList]             = useState<Staff[]>(DEFAULT_HOTEL.staff);
  const [newStaff, setNewStaff]               = useState<Staff>(BLANK_STAFF);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState<string | null>(null);

  /* ── Fetch ── */
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Authentication token not found. Please login again.');
          setLoading(false);
          return;
        }
        const response = await axios.get('http://localhost:3001/api/v1/hotels/my-hotel', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (response.data?.data) {
          const d = response.data.data;
          const formatted: HotelDetails = {
            ownerName: d.ownerName || '', hotelName: d.hotelName || '',
            hotelDescription: d.hotelDescription || '', hotelLocation: d.hotelLocation || '',
            hotelImages: d.hotelImages || [], propertyType: d.propertyType || '',
            verified: d.verified || false, VerificationDocuments: d.VerificationDocuments || [],
            contactNumber: d.contactNumber || '', isactive: d.isactive || false,
            facilities: d.facilities || [], checkinTime: d.checkinTime || '14:00',
            checkoutTime: d.checkoutTime || '12:00', pricePerNight: d.pricePerNight || 0,
            rating: d.rating || 0, numberOfReviews: d.numberOfReviews || 0,
            isFeatured: d.isFeatured || false, staff: d.staff || DEFAULT_HOTEL.staff,
          };
          setHotelDetails(formatted); setFormData(formatted);
          setFacilitiesInput(formatted.facilities.join(', '));
          setImageInput(formatted.hotelImages.join('\n'));
          setStaffList(formatted.staff);
          localStorage.setItem('hotelDetails', JSON.stringify(formatted));
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load hotel data');
        const saved = localStorage.getItem('hotelDetails');
        if (saved) {
          const parsed: HotelDetails = JSON.parse(saved);
          setHotelDetails(parsed); setFormData(parsed);
          setFacilitiesInput(parsed.facilities.join(', '));
          setImageInput(parsed.hotelImages.join('\n'));
          setStaffList(parsed.staff || []);
        }
      } finally { setLoading(false); }
    };
    fetchHotelData();
  }, []);

  /* ── Handlers ── */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = () => {
    const updated: HotelDetails = {
      ...formData,
      facilities:  facilitiesInput.split(',').map((f) => f.trim()).filter(Boolean),
      hotelImages: imageInput.split('\n').map((i) => i.trim()).filter(Boolean),
      staff: staffList,
    };
    setHotelDetails(updated);
    localStorage.setItem('hotelDetails', JSON.stringify(updated));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(hotelDetails);
    setFacilitiesInput(hotelDetails.facilities.join(', '));
    setImageInput(hotelDetails.hotelImages.join('\n'));
    setIsEditing(false);
  };

  const D = isEditing ? formData : hotelDetails;

  /* ── Inline field ── */
  const Field = ({
    label, name, type = 'text', value, onChange, accent = false,
  }: {
    label: string; name: string; type?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accent?: boolean;
  }) => (
    <div className="mb-5 last:mb-0">
      <label className={labelCls}>{label}</label>
      {isEditing ? (
        <input className={inputCls} type={type} name={name} value={value} onChange={onChange} />
      ) : (
        <p className={accent
          ? 'font-serif text-2xl font-bold text-amber-600 mt-0.5'
          : 'text-sm font-medium text-stone-700 mt-0.5 leading-relaxed'
        }>
          {value || '—'}
        </p>
      )}
    </div>
  );

  /* ─────────────────────────────────────────────────────────
     Render
  ───────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F7F3EE]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', Georgia, serif !important; }
      `}</style>

      {/* ── Hero ── */}
      <header className="relative bg-[#3D1F12] overflow-hidden px-10 pt-10 pb-8 flex items-end justify-between gap-6 flex-wrap">
        {/* Gold shimmer top border */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="h-px w-6 bg-amber-400/60" />
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-amber-300/80">Hotel Management</span>
            <span className="h-px w-6 bg-amber-400/60" />
          </div>
          <h1 className="font-serif text-5xl font-semibold text-[#FFF8F0] leading-tight tracking-tight">
            <span className="text-amber-300 italic">Property</span> Settings
          </h1>
          <p className="mt-2 text-sm text-[#FFF8F0]/40 font-light tracking-wide">
            {D.hotelName} · {D.hotelLocation}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold tracking-wide bg-red-900/20 border border-red-700/40 text-red-300 hover:bg-red-900/35 transition-all cursor-pointer"
              >
                ✕ Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide bg-gradient-to-br from-emerald-600 to-emerald-800 text-emerald-50 shadow-lg hover:-translate-y-px transition-all cursor-pointer"
              >
                ✓ Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide bg-gradient-to-br from-amber-400 to-amber-600 text-[#3D1F12] shadow-lg hover:-translate-y-px hover:from-amber-300 hover:to-amber-500 transition-all cursor-pointer"
            >
              ✎ Edit Details
            </button>
          )}
        </div>
      </header>

      {/* ── Alerts ── */}
      {loading && (
        <div className="mx-10 mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-100/70 border border-amber-200 text-amber-800 text-sm font-medium">
          ⏳ Loading hotel information…
        </div>
      )}
      {error && (
        <div className="mx-10 mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          ⚠ {error}
        </div>
      )}

      {/* ── Content ── */}
      <div className="px-10 pt-8 pb-16 flex flex-col gap-5">

        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <Card>
            <CardTitle icon="🏨">Basic Information</CardTitle>
            <Field label="Owner Name"     name="ownerName"     value={D.ownerName}     onChange={handleInputChange} />
            <Field label="Hotel Name"     name="hotelName"     value={D.hotelName}     onChange={handleInputChange} />
            <Field label="Property Type"  name="propertyType"  value={D.propertyType}  onChange={handleInputChange} />
            <Field label="Contact Number" name="contactNumber" type="tel" value={D.contactNumber} onChange={handleInputChange} />
          </Card>

          <Card>
            <CardTitle icon="📍">Location & Pricing</CardTitle>
            <Field label="Location" name="hotelLocation" value={D.hotelLocation} onChange={handleInputChange} />

            <div className="mb-5">
              <label className={labelCls}>Price Per Night (Rs.)</label>
              {isEditing ? (
                <input className={inputCls} type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleInputChange} />
              ) : (
                <p className="font-serif text-2xl font-bold text-amber-600 mt-0.5">
                  Rs. {D.pricePerNight.toLocaleString()}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Check-in</label>
                {isEditing
                  ? <input className={inputCls} type="time" name="checkinTime" value={formData.checkinTime} onChange={handleInputChange} />
                  : <p className="text-sm font-medium text-stone-700 mt-0.5">{D.checkinTime}</p>}
              </div>
              <div>
                <label className={labelCls}>Check-out</label>
                {isEditing
                  ? <input className={inputCls} type="time" name="checkoutTime" value={formData.checkoutTime} onChange={handleInputChange} />
                  : <p className="text-sm font-medium text-stone-700 mt-0.5">{D.checkoutTime}</p>}
              </div>
            </div>
          </Card>
        </div>

        {/* Row 2: Description */}
        <Card>
          <CardTitle icon="✍️">Description</CardTitle>
          {isEditing ? (
            <textarea
              className={`${inputCls} min-h-[110px] resize-y leading-relaxed`}
              name="hotelDescription"
              value={formData.hotelDescription}
              onChange={handleInputChange}
            />
          ) : (
            <p className="text-sm font-medium text-stone-600 leading-[1.8]">{D.hotelDescription}</p>
          )}
        </Card>

        {/* Row 3: Facilities + Rating */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <Card>
            <CardTitle icon="🛎">Facilities</CardTitle>
            {isEditing ? (
              <div>
                <label className={labelCls}>Comma-separated</label>
                <textarea
                  className={`${inputCls} min-h-[110px] resize-y`}
                  value={facilitiesInput}
                  onChange={(e) => setFacilitiesInput(e.target.value)}
                  placeholder="Free WiFi, Parking, Breakfast, Spa…"
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {D.facilities.map((f, i) => (
                  <span key={i} className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-amber-50 text-amber-700 border border-amber-200/80">
                    {f}
                  </span>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardTitle icon="⭐">Rating & Reviews</CardTitle>
            <div className="mb-6">
              <label className={labelCls}>Overall Rating</label>
              <p className="font-serif text-4xl font-bold text-stone-800 leading-none mt-1">
                {D.rating}
                <span className="text-base font-sans font-normal text-stone-400 ml-1">/ 5.0</span>
              </p>
              <StarRating rating={D.rating} />
            </div>
            <div>
              <label className={labelCls}>Total Reviews</label>
              <p className="text-sm font-medium text-stone-700 mt-0.5">{D.numberOfReviews.toLocaleString()} reviews</p>
            </div>
          </Card>
        </div>

        {/* Row 4: Status + Hotel Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <Card>
            <CardTitle icon="🔖">Status & Visibility</CardTitle>
            <div className="flex flex-col gap-3">
              {(
                [
                  { name: 'isactive',   label: 'Hotel Active', value: formData.isactive,   display: D.isactive   },
                  { name: 'verified',   label: 'Verified',     value: formData.verified,   display: D.verified   },
                  { name: 'isFeatured', label: 'Featured',     value: formData.isFeatured, display: D.isFeatured },
                ] as { name: string; label: string; value: boolean; display: boolean }[]
              ).map(({ name, label, value, display }) => (
                <div key={name} className="flex items-center justify-between px-4 py-3 rounded-xl bg-stone-50 border border-stone-100">
                  {isEditing ? (
                    <label className="flex items-center gap-3 cursor-pointer w-full">
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, [name]: !value }))}
                        className={`relative w-10 h-[22px] rounded-full transition-colors shrink-0 cursor-pointer ${value ? 'bg-emerald-500' : 'bg-stone-300'}`}
                      >
                        <span className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
                      </button>
                      <span className="text-sm font-medium text-stone-700">{label}</span>
                    </label>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-stone-700">{label}</span>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
                        display ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${display ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {display ? 'Yes' : 'No'}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle icon="🖼">Hotel Images</CardTitle>
            {isEditing ? (
              <div>
                <label className={labelCls}>One URL per line</label>
                <textarea
                  className={`${inputCls} min-h-[110px] resize-y font-mono text-xs`}
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="https://…"
                />
              </div>
            ) : D.hotelImages.length > 0 ? (
              <div className="flex flex-col gap-2">
                {D.hotelImages.map((img, i) => (
                  <a
                    key={i}
                    href={img}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-amber-50/60 border border-stone-200 hover:border-amber-400 hover:bg-amber-50 transition-all no-underline group"
                  >
                    <span className="text-xs shrink-0">🔗</span>
                    <span className="text-xs font-medium text-stone-500 truncate group-hover:text-amber-700 transition-colors">
                      Image {i + 1} — {img}
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-stone-400 py-3">No images added yet.</p>
            )}
          </Card>
        </div>

        {/* Row 5: Verification Documents */}
        <Card>
          <CardTitle icon="📋">Verification Documents</CardTitle>
          {D.VerificationDocuments.length > 0 ? (
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
              {D.VerificationDocuments.map((doc, i) => (
                <div
                  key={i}
                  className="relative rounded-xl overflow-hidden border-2 border-stone-100 hover:border-amber-300 hover:shadow-md transition-all group cursor-pointer bg-stone-100"
                  style={{ aspectRatio: '3/2' }}
                >
                  <img src={doc} alt={`Doc ${i + 1}`} className="w-full h-full object-cover" />
                  <a
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-[#3D1F12]/65 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[#FFF8F0] text-xs font-bold no-underline"
                  >
                    ↗ Open
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-stone-400 py-2">No verification documents uploaded.</p>
          )}
        </Card>

        {/* Row 6: Staff */}
        <Card>
          <CardTitle
            icon="👥"
            badge={
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                {staffList.length} members
              </span>
            }
          >
            Staff &amp; Employees
          </CardTitle>

          {staffList.length > 0 ? (
            <div className="flex flex-col gap-2.5 mb-5">
              {staffList.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-stone-50 border border-stone-100 hover:border-amber-200 hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center font-serif font-bold text-[#3D1F12] text-sm shrink-0">
                    {initials(s.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-800 mb-1">{s.name}</p>
                    <div className="flex gap-4 text-xs text-stone-400 flex-wrap">
                      <span>◆ {s.position}</span>
                      <span>✉ {s.email}</span>
                      <span>☎ {s.phone}</span>
                      <span className={s.status === 'active' ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'}>
                        ● {s.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {isEditing && (
                    <button
                      onClick={() => setStaffList((prev) => prev.filter((x) => x.id !== s.id))}
                      className="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-transparent border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 transition-all cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-stone-400 mb-5">No staff members added yet.</p>
          )}

          {/* Add Staff Form */}
          {isEditing && (
            <div className="bg-amber-50/40 border-2 border-dashed border-amber-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold tracking-[2px] uppercase text-amber-600">Add New Staff Member</span>
                <span className="flex-1 h-px bg-amber-200/60" />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <input className={inputCls} type="text"  placeholder="Full Name" value={newStaff.name}     onChange={(e) => setNewStaff((p) => ({ ...p, name: e.target.value }))} />
                <input className={inputCls} type="text"  placeholder="Position"  value={newStaff.position} onChange={(e) => setNewStaff((p) => ({ ...p, position: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input className={inputCls} type="email" placeholder="Email"     value={newStaff.email}    onChange={(e) => setNewStaff((p) => ({ ...p, email: e.target.value }))} />
                <input className={inputCls} type="tel"   placeholder="Phone"     value={newStaff.phone}    onChange={(e) => setNewStaff((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input className={inputCls} type="date" value={newStaff.joinDate} onChange={(e) => setNewStaff((p) => ({ ...p, joinDate: e.target.value }))} />
                <select
                  className={inputCls}
                  value={newStaff.status}
                  onChange={(e) => setNewStaff((p) => ({ ...p, status: e.target.value as 'active' | 'inactive' }))}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button
                onClick={handleAddStaff}
                className="w-full py-3 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-amber-400 to-amber-500 text-[#3D1F12] shadow-md hover:from-amber-300 hover:to-amber-400 hover:-translate-y-px transition-all cursor-pointer"
              >
                + Add Staff Member
              </button>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};

export default HotelSettingsPage;