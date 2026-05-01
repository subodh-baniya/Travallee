import { useEffect, useState } from "react";
import {StatCard} from "../Components/Statcard";

import {
  FaBed,
  FaCalendarCheck,
  FaDollarSign,
  FaUsers,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";


interface Stats {
  totalBookings: number;
  revenue: number;
  occupancyRate: number;
  totalGuests: number;
}

interface RevenueItem {
  day: string;
  revenue: number;
}

interface OccupancyItem {
  day: string;
  occupancy: number;
}

interface PieItem {
  name: string;
  value: number;
}

interface Booking {
  id: string;
  guestName: string;
  roomType: string;
  nights: number;
  status: string;
}

interface DashboardData {
  stats: Stats;
  revenueTrend: RevenueItem[];
  occupancyTrend: OccupancyItem[];
  roomDistribution: PieItem[];
  recentBookings: Booking[];
}


const mockData: DashboardData = {
  stats: {
    totalBookings: 128,
    revenue: 4320,
    occupancyRate: 76,
    totalGuests: 54,
  },
  revenueTrend: [
    { day: "Mon", revenue: 400 },
    { day: "Tue", revenue: 700 },
    { day: "Wed", revenue: 500 },
    { day: "Thu", revenue: 900 },
  ],
  occupancyTrend: [
    { day: "Mon", occupancy: 60 },
    { day: "Tue", occupancy: 70 },
    { day: "Wed", occupancy: 65 },
    { day: "Thu", occupancy: 80 },
  ],
  roomDistribution: [
    { name: "Deluxe", value: 40 },
    { name: "Suite", value: 25 },
    { name: "Standard", value: 35 },
  ],
  recentBookings: [
    {
      id: "1",
      guestName: "John Doe",
      roomType: "Deluxe",
      nights: 2,
      status: "CONFIRMED",
    },
  ],
};


const COLORS = ["#2563eb", "#60a5fa", "#93c5fd"];

const Overview = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {

      setData(mockData);
    };

    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Bookings"
          value={data.stats.totalBookings}
          icon={<FaCalendarCheck />}
          accent="blue"
        />
        <StatCard
          title="Revenue"
          value={`$${data.stats.revenue}`}
          icon={<FaDollarSign />}
          accent="green"
        />
        <StatCard
          title="Occupancy"
          value={`${data.stats.occupancyRate}%`}
          icon={<FaBed />}
          accent="purple"
        />
        <StatCard
          title="Guests"
          value={data.stats.totalGuests}
          icon={<FaUsers />}
          accent="orange"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm h-72">
          <h3 className="text-sm font-medium mb-4">Revenue</h3>

          <ResponsiveContainer>
            <LineChart data={data.revenueTrend}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm h-72">
          <h3 className="text-sm font-medium mb-4">Room Types</h3>

          <ResponsiveContainer>
            <PieChart>
              <Pie data={data.roomDistribution} dataKey="value">
                {data.roomDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm h-72">
          <h3 className="text-sm font-medium mb-4">Occupancy</h3>

          <ResponsiveContainer>
            <BarChart data={data.occupancyTrend}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="occupancy" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium mb-4">Recent Bookings</h3>

          <div className="space-y-3">
            {data.recentBookings.map((b) => (
              <div
                key={b.id}
                className="flex justify-between p-3 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium">{b.guestName}</p>
                  <p className="text-xs text-gray-500">
                    {b.nights} nights • {b.roomType}
                  </p>
                </div>

                <span className="text-xs text-blue-600">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Overview;