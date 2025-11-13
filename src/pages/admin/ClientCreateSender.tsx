import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAppSelector } from "../../hooks/redux";
import { getApiUrl, API_CONFIG } from "../../config/api";

interface Client {
  ID: string;
  Name: string;
  Description: string;
  IsActive: boolean;
}

const ClientCreateSender: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    sender_id: "",
    type: "",
    dlt_entity_principall_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientsLoading, setClientsLoading] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  React.useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          "https://platform.shauryatechnosoft.com/notification-api/api/v1/o/clients/list/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.status === "success") {
          const clientsList = response.data.data || [];
          setClients(clientsList);
          if (clientsList.length > 0) {
            setSelectedClientId(clientsList[0].ID);
            localStorage.setItem("client_id", clientsList[0].ID);
          }
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        setMessage("Failed to fetch clients list.");
      } finally {
        setClientsLoading(false);
      }
    };

    fetchClients();
  }, [token]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClientId = e.target.value;
    setSelectedClientId(newClientId);
    localStorage.setItem("client_id", newClientId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!selectedClientId) {
      setMessage("Please select a client first.");
      setLoading(false);
      return;
    }

    const payload = {
      client_id: selectedClientId,
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
        setFormData({ sender_id: "", type: "", dlt_entity_principall_id: "" });
        setTimeout(() => setMessage(""), 3000);
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
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Create Sender
          </h1>
          <p className="text-gray-400">Add a new sender ID for client campaigns</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl border border-white/10 bg-white/5 rounded-2xl p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-3">Select Client *</label>
              {clientsLoading ? (
                <div className="flex items-center justify-center py-3">
                  <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="ml-2 text-gray-400">Loading clients...</span>
                </div>
              ) : (
                <select
                  value={selectedClientId}
                  onChange={handleClientChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                  required
                >
                  <option value="" className="bg-gray-800">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.ID} value={client.ID} className="bg-gray-800">
                      {client.Name} {!client.IsActive && "(Inactive)"}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">Sender ID *</label>
              <input
                type="text"
                name="sender_id"
                value={formData.sender_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                placeholder="Enter sender ID"
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">Type *</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="type"
                    value="promotional"
                    checked={formData.type === "promotional"}
                    onChange={handleChange}
                    className="w-5 h-5"
                    required
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">Promotional</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="type"
                    value="transactional"
                    checked={formData.type === "transactional"}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">Transactional</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">DLT Entity Principal ID</label>
              <input
                type="text"
                name="dlt_entity_principall_id"
                value={formData.dlt_entity_principall_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                placeholder="Enter DLT Entity ID (optional)"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-70"
            >
              {loading ? "Creating..." : "Create Sender"}
            </motion.button>
          </form>

          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 text-center text-base font-semibold ${
                message.includes("✅") ? "text-cyan-400" : "text-red-400"
              }`}
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ClientCreateSender;
