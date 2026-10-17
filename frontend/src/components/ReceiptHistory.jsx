import { useState, useEffect } from "react";
import axios from "axios";

const CATEGORIES = [
  "All", "Food", "Grocery", "Clothes",
  "Travel", "Medicine", "Electronics", "Entertainment", "Other"
];

const CATEGORY_COLORS = {
  Food         : "bg-blue-100 text-blue-700",
  Grocery      : "bg-green-100 text-green-700",
  Clothes      : "bg-yellow-100 text-yellow-700",
  Travel       : "bg-purple-100 text-purple-700",
  Medicine     : "bg-red-100 text-red-700",
  Electronics  : "bg-cyan-100 text-cyan-700",
  Entertainment: "bg-pink-100 text-pink-700",
  Other        : "bg-gray-100 text-gray-700",
};

const CATEGORY_EMOJI = {
  Food         : "🍔",
  Grocery      : "🛒",
  Clothes      : "👗",
  Travel       : "✈️",
  Medicine     : "💊",
  Electronics  : "💻",
  Entertainment: "🎬",
  Other        : "📦",
};

function ReceiptHistory({ apiUrl }) {
  const [receipts, setReceipts]         = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [category, setCategory]         = useState("All");
  const [search, setSearch]             = useState("");
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    let result = receipts;
    if (category !== "All") {
      result = result.filter((r) => r.category === category);
    }
    if (search.trim()) {
      result = result.filter((r) =>
        r.store_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [category, search, receipts]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${apiUrl}/receipts/history`);
      setReceipts(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mt-6">
      <h3 className="text-sm font-medium text-gray-600 mb-4">
        🧾 Receipt history
      </h3>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by store name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
        />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                category === cat
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-8">
          Loading receipts...
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          No receipts found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelected(r)}
              className="border border-gray-100 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm cursor-pointer transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-2xl">
                  {CATEGORY_EMOJI[r.category] || "📄"}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    CATEGORY_COLORS[r.category] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {r.category}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {r.store_name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{r.date}</p>
              <p className="text-base font-bold text-indigo-600 mt-2">
                ₹{r.total_amount?.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {r.items?.length > 0
                  ? `${r.items.length} items`
                  : "No items"}
              </p>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-3xl mb-1">
                    {CATEGORY_EMOJI[selected.category] || "📄"}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {selected.store_name}
                  </h2>
                  <p className="text-xs text-gray-400">{selected.date}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    CATEGORY_COLORS[selected.category] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selected.category}
                </span>
                <span className="text-sm font-bold text-indigo-600">
                  ₹{selected.total_amount?.toLocaleString()}
                </span>
              </div>

              {selected.items && selected.items.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-500 mb-3">
                    ITEMS PURCHASED
                  </p>
                  <div className="space-y-2">
                    {selected.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-700">{item.name}</span>
                        <span className="font-medium text-gray-800">
                          ₹{item.price?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between text-sm font-semibold">
                    <span className="text-gray-700">Total</span>
                    <span className="text-indigo-600">
                      ₹{selected.total_amount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelected(null)}
                className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceiptHistory;