import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import axios from "axios";
import { TagIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../../hooks/redux";
import { getApiUrl, API_CONFIG } from "../../config/api";

interface Client {
  ID: string;
  Name: string;
}

interface Project {
  ID: string;
  Name: string;
}

interface Sender {
  ID: string;
  SenderId: string;
  Type?: 'Promotional' | 'Transactional' | string; // Added Type for filtering
}

// Updated form state structure
interface TemplateForm {
  name: string;
  content: string;
  purposeType: "" | "promotional" | "transactional"; // New field
  senderIds: string[]; // Updated to array for multi-select
}

const ClientCreateTemplate: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);

  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allSenders, setAllSenders] = useState<Sender[]>([]); // Renamed to allSenders
  
  // NOTE: In the original code, selectedSenderId was used, but the new design suggests multi-select, 
  // so we'll rely on form.senderIds. However, I'll keep it for clarity if the API expects one ID. 
  // For this implementation, we'll use form.senderIds.

  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  // const [selectedSenderId, setSelectedSenderId] = useState(""); // Removed/deprecated for multi-select

  const [form, setForm] = useState<TemplateForm>({
    name: "",
    content: "",
    purposeType: "",
    senderIds: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --- Data Loading Effects ---

  // Load all clients (Unchanged)
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(
          "https://platform.shauryatechnosoft.com/notification-api/api/v1/o/clients/list/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.status === "success") {
          setClients(res.data.data || []);
        }
      } catch (error) {
        console.error("Client load error:", error);
      }
    };
    fetchClients();
  }, [token]);

  // Load projects for selected client (Unchanged)
  useEffect(() => {
    // Reset projects and project selection when client changes
    setProjects([]);
    setSelectedProjectId("");
    if (!selectedClientId) return;

    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          getApiUrl(API_CONFIG.ENDPOINTS.PROJECTS + `/${selectedClientId}`),
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.status === "success") {
          setProjects(res.data.data || []);
        }
      } catch (error) {
        console.error("Project load error:", error);
      }
    };
    fetchProjects();
  }, [selectedClientId, token]);

  // Load senders for selected client (Updated to use setAllSenders)
  useEffect(() => {
    setAllSenders([]); // Reset senders when client changes
    setForm(prev => ({...prev, purposeType: "", senderIds: []})) // Reset purpose/senders
    if (!selectedClientId) return;

    const fetchSenders = async () => {
      try {
        const res = await axios.get(
          getApiUrl(
            API_CONFIG.ENDPOINTS.SENDERS +
              `/filter?client_id=${selectedClientId}`
          ),
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.status === "success") {
          // Assuming the API returns sender objects with a 'Type' field
          setAllSenders(res.data.data || []); 
        }
      } catch (error) {
        console.error("Sender load error:", error);
      }
    };
    fetchSenders();
  }, [selectedClientId, token]);
  
  // --- Form Handlers ---
  
  const handlePurposeTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedType = e.target.value as "" | "promotional" | "transactional";
    setForm(prev => ({
      ...prev,
      purposeType: selectedType,
      senderIds: [], // Important: Reset senders when the type changes
    }));
  };

  const handleSenderToggle = (senderId: string) => {
    setForm(prev => {
      const isSelected = prev.senderIds.includes(senderId);
      return {
        ...prev,
        senderIds: isSelected
          ? prev.senderIds.filter(id => id !== senderId)
          : [...prev.senderIds, senderId],
      };
    });
  };

  // Submit Template
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Updated validation
    if (!selectedClientId || !selectedProjectId || !form.purposeType || form.senderIds.length === 0) {
      setMessage("Client, Project, Template Type, and at least one Sender are required.");
      return;
    }
    
    // NOTE: The original component's API structure only allowed for a single 'sender_id'. 
    // The new design uses multi-select 'senderIds'. I'll send the first selected sender ID 
    // to match the previous API payload structure, but you may need to adjust your API to handle an array.
    const senderIdForAPI = form.senderIds[0];


    setLoading(true);
    setMessage("");

    const payload = {
      client_id: selectedClientId,
      project_id: selectedProjectId,
      sender_id: senderIdForAPI, // Using the first selected sender ID
      name: form.name,
      content: form.content,
      // NOTE: Assuming your API for 'templates' needs 'type' or 'purposeType'
      // If the API accepts it, uncomment the line below:
      // type: form.purposeType, 
    };

    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.TEMPLATES);
      const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === "success") {
        setMessage("Template created successfully!");
        setForm({ name: "", content: "", purposeType: "", senderIds: [] });
        setSelectedProjectId(""); // Clear project selection
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.data.error || res.data.message);
      }
    } catch (error: any) {
      console.error("Template create error:", error);
      setMessage(
        error.response?.data?.error ||
          "Failed to create template. Check your inputs."
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Filter senders based on the selected purpose type
  const filteredSenders = allSenders.filter(
    (sender) =>
      sender.Type?.toLowerCase() === form.purposeType.toLowerCase()
  );

  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl">
              <TagIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Create Template
              </h1>
              <p className="text-gray-400 mt-1">Admin template creation</p>
            </div>
          </div>
        </motion.div>

        {/* SEPARATE CLIENT DROPDOWN */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 backdrop-blur-xl border border-white/10 bg-white/5 rounded-2xl p-6 shadow-xl"
        >
          <label className="block text-white font-semibold mb-3 text-lg">
            Select Client *
          </label>
          <select
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none" // Added appearance-none for better styling control
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            required
          >
            <option value="" className="bg-gray-800">Select a client</option>
            {clients.map((c) => (
              <option key={c.ID} value={c.ID} className="bg-gray-800">
                {c.Name}
              </option>
            ))}
          </select>
        </motion.div>

        {/* MAIN FORM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl border border-white/10 bg-white/5 rounded-2xl p-8 shadow-2xl"
        >
          {!selectedClientId ? (
            <p className="text-gray-400 text-center text-lg">
              Select a client to continue
            </p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key="form-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Project Select */}
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Select Project *
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white appearance-none"
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      required
                    >
                      <option value="" className="bg-gray-800">Select a project</option>
                      {projects.map((p) => (
                        <option key={p.ID} value={p.ID} className="bg-gray-800">
                          {p.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Template Name */}
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400"
                      placeholder="Enter template name"
                      required
                    />
                  </div>

                  {/* Template Content */}
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Template Content *
                    </label>
                    <textarea
                      value={form.content}
                      onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white h-40 placeholder-gray-400 resize-none"
                      placeholder="Enter template message"
                      required
                    ></textarea>
                  </div>
                  
                  {/* 🔹 Template Type (Radio Buttons) */}
                  <div>
                    <label className="block text-white font-semibold mb-3">
                      Template Type *
                    </label>
                    <div className="flex space-x-6 text-white">
                      {["Promotional", "Transactional"].map((type) => (
                        <label
                          key={type}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="purposeType"
                            value={type.toLowerCase()}
                            checked={form.purposeType === type.toLowerCase()}
                            onChange={handlePurposeTypeChange}
                            required
                            className="w-4 h-4 text-purple-500 focus:ring-purple-500/50 border-gray-600 bg-gray-700 cursor-pointer"
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 🔹 Inline Multi-select Senders (Checkbox List) */}
                  {form.purposeType && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <label className="block text-white font-semibold mb-3">
                        Select Senders (
                        {form.purposeType === "promotional" ? "Promotional" : "Transactional"}
                        ) *
                      </label>

                      {filteredSenders.length > 0 ? (
                        <>
                          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-wrap gap-3">
                            {filteredSenders.map((sender) => (
                              <label
                                key={sender.ID}
                                className={`flex items-center space-x-2 text-sm cursor-pointer rounded-full px-3 py-2 border transition-all duration-200 
                                  ${
                                    form.senderIds.includes(sender.SenderId)
                                      ? "bg-purple-600/60 border-purple-400 text-white"
                                      : "bg-white/10 border-white/10 text-gray-300 hover:bg-purple-600/30"
                                  }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={form.senderIds.includes(sender.SenderId)}
                                  onChange={() => handleSenderToggle(sender.SenderId)}
                                  className="sr-only" // Hidden checkbox, let the label style do the work
                                />
                                <span className="text-xs font-medium">
                                  {form.senderIds.includes(sender.SenderId) ? '✅' : '⬜'} 
                                </span>
                                <span>{sender.SenderId}</span>
                              </label>
                            ))}
                          </div>

                          {form.senderIds.length === 0 && (
                            <p className="text-red-400 text-sm mt-2">
                              Please select at least one sender.
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-red-400 text-sm mt-1">
                          No {form.purposeType} senders available for this client.
                        </p>
                      )}
                    </motion.div>
                  )}


                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl mt-8"
                    type="submit"
                    disabled={loading || !selectedClientId || !selectedProjectId || !form.purposeType || form.senderIds.length === 0}
                  >
                    {loading ? "Creating..." : "Create Template"}
                  </motion.button>
                </form>
              </motion.div>
            </AnimatePresence>
          )}

          {message && (
            <p
              className={`mt-6 text-center font-semibold ${
                message.includes("success")
                  ? "text-cyan-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ClientCreateTemplate;