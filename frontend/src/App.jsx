import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import InsightsPage from "./pages/InsightsPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/"         element={<DashboardPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/history"  element={<HistoryPage />} />
      </Routes>
    </div>
  );
}

export default App;