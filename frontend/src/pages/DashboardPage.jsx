import { useState, useEffect } from "react";
import axios from "axios";
import UploadReceipt from "../components/UploadReceipt";
import Dashboard from "../components/Dashboard";
import MonthlySummary from "../components/MonthlySummary";


const API_URL = import.meta.env.VITE_API_URL;

function DashboardPage() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchReceipts = async () => {
    try {
      const res = await axios.get(`${API_URL}/receipts/`);
      setReceipts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReceipts(); }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Your spending overview
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Upload receipts and track where your money goes
          </p>
        </div>
        {!loading && receipts.length > 0 && (
          <MonthlySummary apiUrl={API_URL} />
        )}
      </div>

      <UploadReceipt apiUrl={API_URL} onUploadSuccess={fetchReceipts} />

      {loading ? (
        <p className="text-gray-400 text-sm mt-6">Loading...</p>
      ) : (
        <Dashboard receipts={receipts} />
      )}
    </div>
  );
}

export default DashboardPage;