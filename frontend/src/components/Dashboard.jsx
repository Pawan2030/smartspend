import { useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const CATEGORY_COLORS = {
  Food         : "#3b82f6",
  Grocery      : "#22c55e",
  Clothes      : "#eab308",
  Travel       : "#8b5cf6",
  Medicine     : "#ef4444",
  Electronics  : "#06b6d4",
  Entertainment: "#ec4899",
  Other        : "#6b7280",
};

const FILTERS = [
  { label: "7D",  days: 7   },
  { label: "1M",  days: 30  },
  { label: "3M",  days: 90  },
  { label: "6M",  days: 180 },
  { label: "1Y",  days: 365 },
  { label: "All", days: null },
];

function filterByDays(receipts, days) {
  if (!days) return receipts;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return receipts.filter((r) => {
    if (!r.date) return false;
    return new Date(r.date) >= cutoff;
  });
}

function Dashboard({ receipts }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const selectedDays = FILTERS.find((f) => f.label === activeFilter)?.days;
  const filtered     = filterByDays(receipts, selectedDays);

  if (receipts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
        No receipts yet. Upload your first one above!
      </div>
    );
  }

  const totalSpent = filtered.reduce((sum, r) => sum + r.total_amount, 0);

  const categoryTotals = {};
  filtered.forEach((r) => {
    categoryTotals[r.category] = (categoryTotals[r.category] || 0) + r.total_amount;
  });

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));

  const monthlyTotals = {};
  filtered.forEach((r) => {
    const month = r.date ? r.date.slice(0, 7) : "Unknown";
    monthlyTotals[month] = (monthlyTotals[month] || 0) + r.total_amount;
  });

  const barData = Object.entries(monthlyTotals)
    .sort()
    .map(([month, total]) => ({
      month,
      total: Math.round(total),
    }));

  const topCategory = pieData.sort((a, b) => b.value - a.value)[0]?.name;

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 uppercase tracking-wide mr-1">
          Showing data for:
        </span>
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setActiveFilter(f.label)}
            className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
              activeFilter === f.label
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 mb-1">Total spent</p>
          <p className="text-2xl font-semibold text-gray-800">
            ₹{totalSpent.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 mb-1">Receipts scanned</p>
          <p className="text-2xl font-semibold text-gray-800">
            {filtered.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 mb-1">Top category</p>
          <p className="text-2xl font-semibold text-gray-800">
            {topCategory || "—"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Spending by category
          </h3>
          {pieData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">
              No data for this period
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {pieData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={CATEGORY_COLORS[entry.name] || "#6b7280"}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Monthly trend
          </h3>
          {barData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">
              No data for this period
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-600 mb-3">
          Category breakdown
        </h3>
        {pieData.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No data for this period
          </p>
        ) : (
          <div className="space-y-3">
            {pieData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[cat.name] || "#6b7280" }}
                />
                <span className="text-sm text-gray-700 flex-1">
                  {cat.name}
                </span>
                <div className="w-32 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(cat.value / totalSpent) * 100}%`,
                      backgroundColor: CATEGORY_COLORS[cat.name] || "#6b7280",
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-800 w-24 text-right">
                  ₹{cat.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-600 mb-3">
          Recent receipts
        </h3>
        <div className="space-y-2">
          {filtered.slice(0, 8).map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between border-b border-gray-100 last:border-0 py-2"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {r.store_name}
                </p>
                <p className="text-xs text-gray-500">
                  {r.category} • {r.date}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                ₹{r.total_amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;