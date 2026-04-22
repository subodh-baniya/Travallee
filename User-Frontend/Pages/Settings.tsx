import { useState } from "react";

/* ---------------- TYPES ---------------- */

interface Settings {
  hotelName: string;
  contact: string;
  location: string;
  esewaId: string;
  khaltiKey: string;
}

/* ---------------- COMPONENT ---------------- */

const Settings = () => {
  const [form, setForm] = useState<Settings>({
    hotelName: "",
    contact: "",
    location: "",
    esewaId: "",
    khaltiKey: "",
  });

  const handleSave = () => {
    // future API
    // await fetch("/api/dashboard/settings", { method: "POST", body: JSON.stringify(form) });
    console.log(form);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">

      <h2 className="text-lg font-semibold">Hotel Settings</h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          placeholder="Hotel Name"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, hotelName: e.target.value })
          }
        />

        <input
          placeholder="Contact"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, contact: e.target.value })
          }
        />

        <input
          placeholder="Location"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <input
          placeholder="eSewa Merchant ID"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, esewaId: e.target.value })
          }
        />

        <input
          placeholder="Khalti Secret Key"
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, khaltiKey: e.target.value })
          }
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>

    </div>
  );
};

export default Settings;