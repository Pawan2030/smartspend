import { useState } from "react";
import axios from "axios";

function MonthlySummary({ apiUrl }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    setOpen(true);
    try {
      const res = await axios.get(`${apiUrl}/receipts/summary`);
      setData(res.data);
    } catch (err) {
      console.error("Summary failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={fetchSummary}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition flex items-center gap-2"
      >
        ✨ Generate Monthly AI Report
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {loading ? (
              <div className="p-10 text-center">
                <div className="text-4xl mb-4">🤖</div>
                <p className="text-gray-600 font-medium">
                  AI is analyzing your spending...
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  This takes a few seconds
                </p>
              </div>
            ) : data ? (
              <div className="p-6">

                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {data.report_title}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      AI-generated based on your receipts
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-xl font-bold ml-4"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-indigo-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-indigo-500 mb-1">Total spent</p>
                    <p className="text-lg font-bold text-indigo-700">
                      ₹{data.total_spent?.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-yellow-600 mb-1">Top category</p>
                    <p className="text-lg font-bold text-yellow-700">
                      {data.top_category}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-green-600 mb-1">Receipts</p>
                    <p className="text-lg font-bold text-green-700">
                      {data.total_receipts}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    📋 SUMMARY
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {data.summary}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    ✅ HIGHLIGHTS
                  </p>
                  <ul className="space-y-2">
                    {data.highlights?.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="text-green-500 mt-0.5 flex-shrink-0">
                          ●
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-blue-600 mb-2">
                    💡 SUGGESTIONS
                  </p>
                  <ul className="space-y-2">
                    {data.suggestions?.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-blue-800"
                      >
                        <span className="flex-shrink-0 mt-0.5">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => setOpen(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg transition"
                  >
                    Close
                  </button>
                </div>

              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthlySummary;