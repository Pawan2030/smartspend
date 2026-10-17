import { useState } from "react";
import axios from "axios";

function UploadReceipt({ apiUrl, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a receipt image first");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${apiUrl}/receipts/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Receipt added successfully!");
      setFile(null);
      onUploadSuccess();
    } catch (err) {
      setMessage("Upload failed. Try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
      <h2 className="text-sm font-medium text-gray-600 mb-3">
        Upload a receipt
      </h2>
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          {uploading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </div>
      {message && (
        <p className="text-sm text-gray-600 mt-3">{message}</p>
      )}
    </div>
  );
}

export default UploadReceipt;