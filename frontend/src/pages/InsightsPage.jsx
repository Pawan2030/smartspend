import Prediction from "../components/Prediction";
import ChatBox from "../components/ChatBox";

const API_URL = import.meta.env.VITE_API_URL;

function InsightsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          AI Insights
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Predictions and chat powered by Gemini AI
        </p>
      </div>

      <div className="space-y-6">
        <Prediction apiUrl={API_URL} />
        <ChatBox apiUrl={API_URL} />
      </div>
    </div>
  );
}

export default InsightsPage;