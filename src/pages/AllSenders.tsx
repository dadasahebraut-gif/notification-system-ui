import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl, API_CONFIG } from "../config/api";
import {
  UserIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const AllSenders: React.FC = () => {
  const navigate = useNavigate();
  const [senders, setSenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const clientId = localStorage.getItem("client_id");

  useEffect(() => {
    const fetchSenders = async () => {
      try {
        if (!clientId) {
          setError("Client ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        const url = `${getApiUrl(
          API_CONFIG.ENDPOINTS.SENDERS
        )}/filter?client_id=${clientId}`;
        const token = localStorage.getItem("token");

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

    fetchSenders();
  }, [clientId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center lg:ml-[280px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading senders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center lg:ml-[280px]">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:ml-[280px]">
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
                <p className="text-gray-400 mt-1">Manage your SMS sender IDs</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/create-sender")}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Sender</span>
            </motion.button>
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
            <p className="text-gray-400 mb-6">
              Create your first sender to get started
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/create-sender")}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 inline-flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Sender</span>
            </motion.button>
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
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSenders;
