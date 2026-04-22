import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ---------------- TYPES ---------------- */

type RoomType = "DELUXE" | "SUITE" | "STANDARD";

interface Room {
  id: string;
  roomNumber: string;
  roomType: RoomType;
  pricePerNight: number;
  capacity: number;
  images: string[];
  isAvailable: boolean;
}

interface RoomResponse {
  rooms: Room[];
}

/* ---------------- MOCK ---------------- */

const mockData: RoomResponse = {
  rooms: [
    {
      id: "1",
      roomNumber: "101",
      roomType: "DELUXE",
      pricePerNight: 120,
      capacity: 2,
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      ],
      isAvailable: true,
    },
    {
      id: "2",
      roomNumber: "202",
      roomType: "SUITE",
      pricePerNight: 220,
      capacity: 4,
      images: [
        "https://images.unsplash.com/photo-1501117716987-c8e1ecb2103f",
      ],
      isAvailable: false,
    },
  ],
};

/* ---------------- COMPONENT ---------------- */

const Rooms = () => {
  const [data, setData] = useState<RoomResponse | null>(null);

  /* FORM STATE */
  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "DELUXE",
    pricePerNight: "",
    capacity: "",
    images: [] as File[],
  });

  useEffect(() => {
    const fetchRooms = async () => {
      // future API
      // const res = await fetch("/api/dashboard/rooms");
      // const json = await res.json();
      // setData(json.data);

      setData(mockData);
    };

    fetchRooms();
  }, []);

  if (!data) return <div>Loading...</div>;

  /* ---------------- CREATE ROOM (mock) ---------------- */

  const handleCreate = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      roomNumber: form.roomNumber,
      roomType: form.roomType as RoomType,
      pricePerNight: Number(form.pricePerNight),
      capacity: Number(form.capacity),
      images: form.images.map((f) => URL.createObjectURL(f)),
      isAvailable: true,
    };

    setData({
      rooms: [newRoom, ...data.rooms],
    });
  };

  return (
    <div className="space-y-6">

      {/* ---------------- CREATE ROOM FORM ---------------- */}
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">

        <h2 className="text-lg font-semibold">Add Room</h2>

        <div className="grid md:grid-cols-4 gap-3">

          <input
            placeholder="Room Number"
            className="border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, roomNumber: e.target.value })
            }
          />

          <select
            className="border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, roomType: e.target.value })
            }
          >
            <option>DELUXE</option>
            <option>SUITE</option>
            <option>STANDARD</option>
          </select>

          <input
            placeholder="Price"
            type="number"
            className="border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, pricePerNight: e.target.value })
            }
          />

          <input
            placeholder="Capacity"
            type="number"
            className="border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, capacity: e.target.value })
            }
          />
        </div>

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          multiple
          className="border p-2 rounded w-full"
          onChange={(e) =>
            setForm({
              ...form,
              images: Array.from(e.target.files || []),
            })
          }
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Room
        </button>
      </div>

      {/* ---------------- ROOMS LIST ---------------- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {data.rooms.map((room) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >

            {/* IMAGE */}
            <img
              src={room.images[0]}
              className="h-40 w-full object-cover"
            />

            {/* DETAILS */}
            <div className="p-4 space-y-2">

              <div className="flex justify-between">
                <h3 className="font-semibold">
                  Room {room.roomNumber}
                </h3>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    room.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {room.isAvailable ? "Available" : "Booked"}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                {room.roomType}
              </p>

              <p className="text-sm">
                Capacity: {room.capacity}
              </p>

              <p className="font-semibold">
                ${room.pricePerNight}/night
              </p>

            </div>
          </motion.div>
        ))}

      </div>

    </div>
  );
};

export default Rooms;