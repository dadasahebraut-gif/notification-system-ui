import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAppSelector } from "../hooks/redux";
import { getApiUrl, API_CONFIG } from "../config/api";
import { useNavigate } from "react-router-dom";
 
 
const CreateSender: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    sender_id: "",
    type: "",
    dlt_entity_principall_id: "",
  });
 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
 
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
 
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
 
    const clientId = localStorage.getItem("client_id");
    if (!clientId) {
      setMessage("Client ID not found in local storage. Please log in again.");
      setLoading(false);
      return;
    }
 
   const payload = {
      client_id: clientId,
      sender_id: formData.sender_id,
      type: formData.type,
      dlt_entity_principall_id: formData.dlt_entity_principall_id,
    };
 
    try {
        const url = `${getApiUrl(API_CONFIG.ENDPOINTS.SENDERS)}`;
        const res = await axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
 
        if (res.data.status === "success") {
          setMessage("✅ Sender created successfully!");
          setTimeout(() => navigate("/all-senders"), 1000);
        } else {
          setMessage(res.data.error || res.data.message || "Failed to create sender.");
        }
      } catch (error: any) {
        console.error("Error creating sender:", error);
 
        if (error.response?.data?.error) {
          setMessage(`⚠️ ${error.response.data.error}`);
        } else {
          setMessage("Error creating sender. Please check your input.");
        }
      } finally {
        setLoading(false);
      }
 
        };
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4 mt-4">
          Create New Sender
        </h2>
      </motion.div>
 
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl border border-white/10 bg-white/5 rounded-xl p-8 shadow-2xl w-full max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sender ID */}
          <div>
            <label className="block text-gray-300 mb-2">Sender ID</label>
            <input
              type="text"
              name="sender_id"
              value={formData.sender_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50"
              placeholder="Enter sender ID"
              required
            />
          </div>
 
         {/* Type */}
          <div>
            <label className="block text-gray-300 mb-2">Type</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="promotional"
                  checked={formData.type === "promotional"}
                  onChange={handleChange}
                  className="w-4 h-4 text-cyan-500 focus:ring-cyan-500/50 border-gray-600 bg-gray-700"
                  required
                />
                <span className="text-white">Promotional</span>
              </label>
 
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="transactional"
                  checked={formData.type === "transactional"}
                  onChange={handleChange}
                  className="w-4 h-4 text-cyan-500 focus:ring-cyan-500/50 border-gray-600 bg-gray-700"
                />
                <span className="text-white">Transactional</span>
              </label>
            </div>
          </div>
 
 
          {/* DLT Entity Principal ID */}
          <div>
            <label className="block text-gray-300 mb-2">
              DLT Entity Principal ID
            </label>
            <input
              type="text"
              name="dlt_entity_principall_id"
              value={formData.dlt_entity_principall_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50"
              placeholder="Enter DLT Entity ID"
            />
          </div>
 
         
          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold rounded-xl transition-all shadow-lg"
          >
            {loading ? "Creating..." : "Create Sender"}
          </motion.button>
        </form>
 
        {message && (
          <p
            className={`mt-4 text-center text-base font-semibold ${
              message.includes("✅") ? "text-cyan-400" : "text-red-400"
            }`}
          >
            {message}
            </p>
 
        )}
      </motion.div>
    </div>
  );
};
 
export default CreateSender;