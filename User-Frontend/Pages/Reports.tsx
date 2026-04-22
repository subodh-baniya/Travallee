import { useEffect, useState } from "react";
import StatCard from "../Components/Statcard";
import { FaMoneyBill, FaHotel, FaUsers, FaChartLine } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------- TYPES ---------------- */

interface ReportStats {
  revenue: number;
  bookings: number;
  guests: number;
  occupancy: number;
}

interface Trend {
  day: string;
  value: number;
}

interface ReportResponse {
  stats: ReportStats;
  trend: Trend[];
}

/* ---------------- MOCK ---------------- */

const mockData: ReportResponse = {
  stats: {
    revenue: 5400,
    bookings: 120,
    guests: 80,
    occupancy: 72,
  },
  trend: [
    { day: "Mon", value: 400 },
    { day: "Tue", value: 800 },
    { day: "Wed", value: 600 },
    { day: "Thu", value: 900 },
  ],
};

/* ---------------- COMPONENT ---------------- */

const Reports = () => {
  const [data, setData] = useState<ReportResponse | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      // const res = await fetch("/api/dashboard/reports");
      // const json = await res.json();
      // setData(json.data);

      setData(mockData);
    };

    fetchReports();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Revenue" value={`$${data.stats.revenue}`} icon={<FaMoneyBill />} />
        <StatCard title="Bookings" value={data.stats.bookings} icon={<FaHotel />} />
        <StatCard title="Guests" value={data.stats.guests} icon={<FaUsers />} />
        <StatCard title="Occupancy" value={`${data.stats.occupancy}%`} icon={<FaChartLine />} />
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow-sm h-80">
        <h3 className="text-sm font-medium mb-4">Performance Trend</h3>

        <ResponsiveContainer>
          <LineChart data={data.trend}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line dataKey="value" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Reports;