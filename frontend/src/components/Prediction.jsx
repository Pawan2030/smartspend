import { useState, useEffect } from "react";
import axios from "axios";

const TREND_COLOR = {
  up: "text-red-600",
  down: "text-green-600",
  stable: "text-gray-500",
};

const TREND_ICON = {
  up: "↑",
  down: "↓",
  stable: "→",
};

function Prediction({ apiUrl, period }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/receipts/predict?period=${period}`);
      setData(res.data);
    } catch (err) {
      console.error("Prediction failed", err);
    } finally {
      setLoading(false);
    }
  };
  fetchPrediction();
}, [apiUrl, period]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-500">
        Generating AI prediction...
      </div>
    );
  }

  if (!data || data.predictions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-gray-600 mb-4">
          🔮 AI prediction — next month
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.predictions.map((p, i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-lg p-4 bg-gray-50"
            >
              <p className="text-xs text-gray-500 mb-1">{p.category}</p>
              <p className="text-xl font-semibold text-gray-800">
                ₹{Math.round(p.predicted_amount).toLocaleString()}
              </p>
              <p
                className={`text-xs font-medium mt-1 ${
                  TREND_COLOR[p.trend] || "text-gray-500"
                }`}
              >
                {TREND_ICON[p.trend]} {p.trend}
              </p>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                {p.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {data.insights && data.insights.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <h3 className="text-sm font-medium text-blue-800 mb-3">
            ✨ AI insights
          </h3>
          <ul className="space-y-2">
            {data.insights.map((insight, i) => (
              <li
                key={i}
                className="text-sm text-blue-900 flex items-start gap-2"
              >
                <span className="text-blue-400 mt-0.5">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Prediction;