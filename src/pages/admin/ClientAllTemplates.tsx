import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAppSelector } from "../../hooks/redux";
import {
  TagIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

interface Client {
  ID: string;
  Name: string;
  Description: string;
  IsActive: boolean;
}

interface Template {
  ID: string;
  ClientID: string;
  ProjectID: string;
  TemplateID: string;
  Name: string;
  Description: string;
  SendorIds: string[] | null;
  Type: string;
  MetaData: any;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

const ClientAllTemplates: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientsLoading, setClientsLoading] = useState(true);

  const fetchTemplates = async (clientId: string) => {
    if (!clientId) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const url = `https://platform.shauryatechnosoft.com/notification-api/api/v1/o/purposes/filter?client_id=${clientId}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === "success") {
        setTemplates(res.data.data || []);
        setError("");
      } else {
        setError(res.data.message || "Failed to fetch templates.");
      }
    } catch (err: any) {
      console.error("Error fetching templates:", err);
      setError("Error fetching templates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        setError("Failed to fetch clients list.");
      } finally {
        setClientsLoading(false);
      }
    };

    fetchClients();
  }, [token]);

  useEffect(() => {
    if (selectedClientId) {
      fetchTemplates(selectedClientId);
    }
  }, [selectedClientId, token]);

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClientId = e.target.value;
    setSelectedClientId(newClientId);
    localStorage.setItem("client_id", newClientId);
  };

  const getMediumInfo = (metadata: any) => {
    try {
      const medium = metadata?.medium || "sms";
      return {
        medium,
        icon:
          medium === "sms" ? (
            <DevicePhoneMobileIcon className="w-4 h-4" />
          ) : (
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
          ),
        color: medium === "sms" ? "text-blue-400" : "text-green-400",
        bgColor: medium === "sms" ? "bg-blue-500/20" : "bg-green-500/20",
        borderColor:
          medium === "sms" ? "border-blue-500/30" : "border-green-500/30",
      };
    } catch {
      return {
        medium: "sms",
        icon: <DevicePhoneMobileIcon className="w-4 h-4" />,
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
        borderColor: "border-blue-500/30",
      };
    }
  };

  if (loading && clientsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading templates...</p>
        </div>
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
                <TagIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  All Templates
                </h1>
                <p className="text-gray-400 mt-1">Manage client message templates</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-white font-semibold mb-3">Select Client</label>
            {clientsLoading ? (
              <div className="flex items-center justify-center py-3">
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span className="ml-2 text-gray-400">Loading clients...</span>
              </div>
            ) : (
              <select
                value={selectedClientId}
                onChange={handleClientChange}
                className="w-full max-w-md px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
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
        </motion.div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
          >
            <TagIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Templates Found
            </h3>
            <p className="text-gray-400">No templates have been created for this client yet</p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-white/10">
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                    Template Name
                  </th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                    Medium
                  </th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                    Template ID
                  </th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template, idx) => {
                  const mediumInfo = getMediumInfo(template.MetaData);
                  return (
                    <motion.tr
                      key={template.ID}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">
                            {template.Name}
                          </p>
                          <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                            {template.Description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${mediumInfo.bgColor} ${mediumInfo.borderColor} border`}
                        >
                          <span className={mediumInfo.color}>
                            {mediumInfo.icon}
                          </span>
                          <span
                            className={`text-xs font-semibold ${mediumInfo.color}`}
                          >
                            {mediumInfo.medium.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <code className="text-xs text-purple-400 bg-black/20 px-2 py-1 rounded">
                            {template.TemplateID}
                          </code>
                          <button
                            onClick={() => navigator.clipboard.writeText(template.TemplateID)}
                            className="p-1 hover:bg-white/10 rounded transition"
                            title="Copy Template ID"
                          >
                            <DocumentDuplicateIcon className="w-4 h-4 text-gray-300 hover:text-white" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300 text-xs capitalize">
                          {template.Type || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {template.IsActive ? (
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
                        <span className="text-gray-400 text-xs">
                          {new Date(template.CreatedAt).toLocaleDateString()}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientAllTemplates;
