import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiUrl, API_CONFIG } from "../config/api";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
 
import {
  TagIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
 
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
 
const AllTemplates: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const clientId = localStorage.getItem("client_id");
 
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        if (!clientId) {
          setError("Client ID not found. Please log in again.");
          setLoading(false);
          return;
        }
 
        const url = `${getApiUrl(
          API_CONFIG.ENDPOINTS.PURPOSES
        )}/filter?client_id=${clientId}`;
        const token = localStorage.getItem("auth_token");
 
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
 
        if (res.data.status === "success") {
          setTemplates(res.data.data || []);
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
 
    fetchTemplates();
  }, [clientId]);
 
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
 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center lg:ml-[280px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading templates...</p>
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
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                <TagIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  All Templates
                </h1>
                <p className="text-gray-400 mt-1">
                  Manage your notification templates
                </p>
              </div>
            </div>
 
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/create-purpose")}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Template</span>
            </motion.button>
          </div>
        </motion.div>
 
        {templates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
          >
            <TagIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Templates Found
            </h3>
            <p className="text-gray-400 mb-6">
              Create your first template to get started
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/create-purpose")}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 inline-flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create Template</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="overflow-x-auto bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/10">
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
 
export default AllTemplates;