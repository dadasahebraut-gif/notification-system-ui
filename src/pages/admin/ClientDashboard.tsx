import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "../../hooks/redux";
import {
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  FolderIcon,
  ChartBarIcon,
  SparklesIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { getApiUrl } from "../../config/api";
import LoadingSpinner from "../../components/LoadingSpinner";

interface ClientData {
  ID: string;
  Name: string;
  Email: string;
  Projects?: any[];
}

interface Membership {
  ID: string;
  Plan?: { Channel: string };
  Status: string;
  QuotaTotal: number;
  QuotaUsed: number;
}

const ClientDashboard: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const clientId = localStorage.getItem("client_id");

  useEffect(() => {
    const fetchData = async () => {
      if (!clientId || !token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      try {
        const [clientRes, memberRes] = await Promise.all([
          fetch(getApiUrl(`/clients/${clientId}`), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(getApiUrl(`/membership/${clientId}`), {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const clientJson = await clientRes.json();
        const memberJson = await memberRes.json();

        if (clientJson.status === "success") {
          setClientData(clientJson.data);
        }
        if (memberJson.status === "success") {
          setMemberships(memberJson.data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-400 mt-6">Loading client dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const activeSMS = memberships.filter(
    (m) => m.Plan?.Channel?.toLowerCase() === "sms" && m.Status?.toLowerCase() === "active"
  );
  const smsUsed = activeSMS.reduce((sum, m) => sum + m.QuotaUsed, 0);
  const smsTotal = activeSMS.reduce((sum, m) => sum + m.QuotaTotal, 0);

  const activeWhatsApp = memberships.filter(
    (m) => m.Plan?.Channel?.toLowerCase() === "whatsapp" && m.Status?.toLowerCase() === "active"
  );
  const waUsed = activeWhatsApp.reduce((sum, m) => sum + m.QuotaUsed, 0);
  const waTotal = activeWhatsApp.reduce((sum, m) => sum + m.QuotaTotal, 0);

  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Client Portal Dashboard
          </h1>
          <p className="text-gray-400">
            Viewing dashboard for: <span className="text-white font-semibold">{clientData?.Name}</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {activeSMS.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-2xl p-6 border border-cyan-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <DevicePhoneMobileIcon className="w-8 h-8 text-cyan-400" />
              </div>
              <p className="text-gray-400 text-sm mb-2">SMS Remaining</p>
              <p className="text-3xl font-bold text-white">{smsTotal - smsUsed}</p>
              <p className="text-xs text-gray-500 mt-2">{smsUsed} / {smsTotal} used</p>
            </motion.div>
          )}

          {activeWhatsApp.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-2xl p-6 border border-green-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-gray-400 text-sm mb-2">WhatsApp Remaining</p>
              <p className="text-3xl font-bold text-white">{waTotal - waUsed}</p>
              <p className="text-xs text-gray-500 mt-2">{waUsed} / {waTotal} used</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <FolderIcon className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-gray-400 text-sm mb-2">Total Projects</p>
            <p className="text-3xl font-bold text-white">{clientData?.Projects?.length || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl p-6 border border-cyan-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <ChartBarIcon className="w-8 h-8 text-cyan-400" />
            </div>
            <p className="text-gray-400 text-sm mb-2">Active Plans</p>
            <p className="text-3xl font-bold text-white">
              {memberships.filter((m) => m.Status?.toLowerCase() === "active").length}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Client Name</p>
              <p className="text-white text-lg font-semibold">{clientData?.Name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Email</p>
              <p className="text-white text-lg font-semibold">{clientData?.Email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Memberships</p>
              <p className="text-white text-lg font-semibold">{memberships.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Active Memberships</p>
              <p className="text-cyan-400 text-lg font-semibold">
                {memberships.filter((m) => m.Status?.toLowerCase() === "active").length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientDashboard;
