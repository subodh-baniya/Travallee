import { useState } from "react";
import { motion } from "framer-motion";

type Status = "SUCCESS" | "PENDING" | "CANCELLED";

interface Transaction {
  id: string;
  amount: number;
  source: string;
  status: Status;
  date: string;
  isoDate: string;
  remark: string;
}


const transactions: Transaction[] = [
  {
    id: "1",
    amount: 8400,
    source: "Room Booking",
    status: "SUCCESS",
    date: "March 8, 2026 · 12:50 PM",
    isoDate: "2026-03-08",
    remark: "Deluxe Room Payment",
  },
  {
    id: "2",
    amount: 27000,
    source: "Suite Booking",
    status: "SUCCESS",
    date: "March 8, 2026 · 11:14 AM",
    isoDate: "2026-03-08",
    remark: "Suite Payment",
  },
  {
    id: "3",
    amount: 8100,
    source: "Room Booking",
    status: "PENDING",
    date: "March 7, 2026 · 10:39 AM",
    isoDate: "2026-03-07",
    remark: "Pending Payment",
  },
  {
    id: "4",
    amount: 4200,
    source: "Room Booking",
    status: "CANCELLED",
    date: "March 6, 2026 · 09:10 AM",
    isoDate: "2026-03-06",
    remark: "Booking Cancelled",
  },
];


const statusMap = {
  SUCCESS: "bg-emerald-50 text-emerald-600 border-emerald-100",
  PENDING: "bg-amber-50 text-amber-600 border-amber-100",
  CANCELLED: "bg-rose-50 text-rose-600 border-rose-100",
};


const Finance = () => {
  const [filter, setFilter] = useState<"ALL" | Status>("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filtered = transactions.filter((t) => {
    const matchStatus = filter === "ALL" || t.status === filter;

    const matchFrom =
      !fromDate || new Date(t.isoDate) >= new Date(fromDate);

    const matchTo =
      !toDate || new Date(t.isoDate) <= new Date(toDate);

    return matchStatus && matchFrom && matchTo;
  });


  const totalIncome = filtered
    .filter((t) => t.status === "SUCCESS")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingIncome = filtered
    .filter((t) => t.status === "PENDING")
    .reduce((sum, t) => sum + t.amount, 0);

  const cancelledLoss = filtered
    .filter((t) => t.status === "CANCELLED")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-lg font-semibold text-slate-900">
          Finance
        </h1>
        <p className="text-xs text-slate-500">
          Income and transaction records
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-500">Total Income</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">
            Rs. {totalIncome.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-500">Pending Income</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">
            Rs. {pendingIncome.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-500">Cancelled Loss</p>
          <h2 className="text-xl font-semibold text-rose-600 mt-1">
            Rs. {cancelledLoss.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs text-slate-500">Transactions</p>
          <h2 className="text-xl font-semibold text-slate-900 mt-1">
            {filtered.length}
          </h2>
        </div>

      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3 items-center">

        <div className="flex gap-2">
          {["ALL", "SUCCESS", "PENDING", "CANCELLED"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-3 py-1.5 text-xs rounded-full transition ${
                filter === s
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-200 rounded-lg"
        />

        <span className="text-xs text-slate-400">to</span>

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-200 rounded-lg"
        />

      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-slate-50 text-slate-500 text-xs">
            <tr>
              <th className="text-left px-4 py-3">SN</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Source</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Remark</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">

            {filtered.map((t, i) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-slate-50 transition"
              >

                <td className="px-4 py-3 text-slate-400">
                  {i + 1}
                </td>

                <td className={`px-4 py-3 font-medium ${
                  t.status === "CANCELLED"
                    ? "text-rose-600"
                    : "text-slate-900"
                }`}>
                  Rs. {t.amount.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {t.source}
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border ${statusMap[t.status]}`}
                  >
                    {t.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-slate-500 text-xs">
                  {t.date}
                </td>

                <td className="px-4 py-3 text-slate-500 text-xs">
                  {t.remark}
                </td>

              </motion.tr>
            ))}

          </tbody>

        </table>
      </div>

    </div>
  );
};

export default Finance;