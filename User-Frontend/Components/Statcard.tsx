import { motion } from "framer-motion";
import { ReactNode } from "react";

type Accent = "blue" | "green" | "purple" | "orange";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  accent?: Accent;
}

const StatCard = ({ title, value, icon, accent = "blue" }: StatCardProps) => {
  const map: Record<Accent, string> = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    orange: "bg-orange-50 text-orange-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>
        </div>

        <div className={`p-3 rounded-lg ${map[accent]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;