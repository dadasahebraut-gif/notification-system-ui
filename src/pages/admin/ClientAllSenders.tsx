import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { getApiUrl, API_CONFIG } from "../../config/api";
import { useAppSelector } from "../../hooks/redux";
import {
  UserIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const ClientAllSenders: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [senders, setSenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const clientId = localStorage.getItem("client_id");
  const [editingSender, setEditingSender] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    sender_id: "",
    type: "",
    dlt_entity_principall_id: "",
  });
  const [message, setMessage] = useState("");

  const fetchSenders = async () => {
    try {
      if (!clientId) {
        setError("Client ID not found.");
        setLoading(false);
        return;
      }

      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.SENDERS)}/filter?client_id=${clientId}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === "success") {
        setSenders(res.data.data || []);
      } else {
        setError(res.data.message || "Failed to fetch senders.");
      }
    } catch (err: any) {
      console.error("Error fetching senders:", err);
      setError("Error fetching senders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSenders();
  }, [clientId, token]);

  const updateSender = async () => {
    if (!editingSender) return;

    try {
      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.SENDERS)}/${editingSender.ID}`;

      const payload = {
        sender_id: formData.sender_id,
        type: formData.type,
        dlt_entity_principall_id: formData.dlt_entity_principall_id,
      };

      await axios.put(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchSenders();
      setMessage("Sender updated successfully ✅");

      setTimeout(() => {
        setMessage("");
        setEditingSender(null);
      }, 2000);
    } catch (err: any) {
      console.error("Update sender error:", err);
      setMessage(err.response?.data?.message || "Sender ID already exists");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading senders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  All Senders
                </h1>
                <p className="text-gray-400 mt-1">Manage client SMS sender IDs</p>
              </div>
            </div>
          </div>
        </motion.div>

        {senders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
          >
            <UserIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Senders Found
            </h3>
            <p className="text-gray-400">No sender IDs have been created yet</p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-white/10">
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                    Sender ID
                  </th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                    DLT Entity
                  </th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {senders.map((sender, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-all duration-200"
                  >
                    <td className="px-6 py-4 text-white font-medium">
                      {sender.SenderId}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 capitalize">
                        {sender.Type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {sender.DLTEntityPrincipallID || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {sender.IsActive ? (
                          <>
                            <CheckCircleIcon className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-xs font-semibold">
                              Active
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 text-xs font-semibold">
                              Inactive
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-blue-400 hover:text-blue-600 text-sm font-semibold"
                        onClick={() => {
                          setEditingSender(sender);
                          setMessage("");
                          setFormData({
                            sender_id: sender.SenderId,
                            type: sender.Type,
                            dlt_entity_principall_id:
                              sender.DLTEntityPrincipallID || "",
                          });
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingSender && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/20 overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-2xl font-bold mb-6 text-white bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Edit Sender
              </h2>

              <label className="block mb-2 text-gray-300 font-semibold">
                Sender ID
              </label>
              <input
                type="text"
                className="w-full mb-4 p-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                value={formData.sender_id}
                onChange={(e) =>
                  setFormData({ ...formData, sender_id: e.target.value })
                }
              />

              <label className="block mb-2 text-gray-300 font-semibold">
                Type
              </label>
              <div className="flex gap-6 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="promotional"
                    checked={formData.type === "promotional"}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="form-radio text-purple-400 focus:ring-purple-400"
                  />
                  <span className="text-white">Promotional</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="transactional"
                    checked={formData.type === "transactional"}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="form-radio text-purple-400 focus:ring-purple-400"
                  />
                  <span className="text-white">Transactional</span>
                </label>
              </div>

              <label className="block mb-2 text-gray-300 font-semibold">
                DLT Entity ID
              </label>
              <input
                type="text"
                className="w-full mb-6 p-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                value={formData.dlt_entity_principall_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dlt_entity_principall_id: e.target.value,
                  })
                }
              />
              {message && (
                <p className="text-sm text-green-300 mb-4">{message}</p>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  className="px-5 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all"
                  onClick={() => setEditingSender(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all"
                  onClick={updateSender}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientAllSenders;
