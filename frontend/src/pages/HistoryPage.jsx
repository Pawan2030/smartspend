import ReceiptHistory from "../components/ReceiptHistory";

const API_URL = import.meta.env.VITE_API_URL;

function HistoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Receipt history
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          All your scanned receipts — filter by category or search by store
        </p>
      </div>
      <ReceiptHistory apiUrl={API_URL} />
    </div>
  );
}

export default HistoryPage;