import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { API_CONFIG } from "../config/api";
import { executeCampaign } from "../api/ExecuteCampaign";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { scheduleCampaign } from "../api/scheduleCampaign";
 
interface Campaign {
  ID: string;
  Name: string;
  Status: string;
  TotalCount: number;
  success: number;
  failed: number;
  CreatedAt: string;
}
 
export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [scheduleAt, setScheduleAt] = useState<Date | null>(null);

  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const clientId = localStorage.getItem("client_id");
        if (!clientId) {
          console.error("client_id not found in localStorage");
          setLoading(false);
          return;
        }
 
        const response = await fetch(
          API_CONFIG.BASE_URL + `${API_CONFIG.ENDPOINTS.CAMPAIGN}/List?clientId=${clientId}`
        );
 
        if (!response.ok) {
          throw new Error("Failed to fetch campaign list");
        }
 
        const data = await response.json();
 
        if (data?.data) {
          setCampaigns(data.data);
        } else {
          console.warn("Unexpected API response:", data);
        }
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
 
    fetchCampaigns();
  }, []);
 
  // 🔹 Execute campaign with loader
  const handleExecute = async (id: string) => {
    try {
      setActionLoading(true);
      setLoadingMessage("Executing campaign...");
      await executeCampaign(id);
      setLoadingMessage("Campaign executed successfully!");
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      console.error("Error executing campaign:", err);
      setLoadingMessage("Error while executing campaign.");
      setTimeout(() => setActionLoading(false), 1500);
    }
  };

const confirmSchedule = () => {
  if (!selectedCampaignId) return;

  if (!scheduleAt) {
    alert("Please select date & time first.");
    return;
  }

  handleSchedule(selectedCampaignId, scheduleAt);
  setShowScheduleModal(false);
};


  // 🔹 Schedule campaign with loader (mocked for now)
 const handleSchedule = async (id: string, scheduledDate: Date) => {
  try {
    setActionLoading(true);
    setLoadingMessage("Scheduling campaign...");

    await scheduleCampaign(id, scheduledDate.toISOString());

    setLoadingMessage("Campaign scheduled successfully!");
    setTimeout(() => window.location.reload(), 1200);
  } catch (err) {
    console.error("Error scheduling campaign:", err);
    setLoadingMessage("Error while scheduling campaign.");
    setTimeout(() => setActionLoading(false), 1500);
  }
};

 
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start px-6 py-10 border-white/10 bg-white/5">
      {/* 🔹 Loader Overlay */}
      {actionLoading && (
<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm z-50 p-6 rounded-2xl shadow-2xl border border-white/20">          
<motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-white text-lg font-medium text-center space-y-3"
          >
            <div className="w-10 h-10 border-4 border-t-purple-400 border-white/20 rounded-full animate-spin mx-auto" />
            <p>{loadingMessage}</p>
          </motion.div>
        </div>
      )}
 
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl backdrop-blur-xl border border-white/10 bg-white/5 rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-semibold text-white mb-8 text-center">
          Campaign List
        </h2>
 
        {loading ? (
          <p className="text-gray-400 text-center">Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-gray-400 text-center">No campaigns found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm text-white">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-gray-300 uppercase text-xs tracking-wide">
                  <th className="border border-white/10 px-3 py-3 text-left rounded-tl-lg">
                    Campaign Name
                  </th>
                  <th className="border border-white/10 px-3 py-3 text-left">
                    Status
                  </th>
                  <th className="border border-white/10 px-3 py-3 text-center">
                    Total
                  </th>
                  <th className="border border-white/10 px-3 py-3 text-center">
                    Created
                  </th>
                  <th className="border border-white/10 px-3 py-3 text-center rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
 
              <tbody>
                {campaigns.map((c, idx) => (
                  <motion.tr
                    key={c.ID}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/5 transition-all duration-200"
                  >
                    <td className="border border-white/10 px-3 py-3 font-medium">
                      {c.Name}
                    </td>
                    <td className="border border-white/10 px-3 py-3 capitalize">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          c.Status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : c.Status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {c.Status}
                      </span>
                    </td>
                    <td className="border border-white/10 px-3 py-3 text-center">
                      {c.TotalCount || 0}
                    </td>
                    <td className="border border-white/10 px-3 py-3 text-center text-gray-300">
                      {c.CreatedAt
                        ? new Date(c.CreatedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="border border-white/10 px-3 py-3 text-center space-x-2">
                      {c.Status === "draft" && (
                        <>
                          <button
                            className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md text-xs hover:opacity-90 transition"
                            onClick={() => handleExecute(c.ID)}
                          >
                            Execute
                          </button>
                          <button
                            className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-md text-xs hover:opacity-90 transition"
                            onClick={() => {
                                setSelectedCampaignId(c.ID);
                                setShowScheduleModal(true);
                              }}

                          >
                            Schedule
                          </button>
                        </>
                      )}
 
                      {c.Status === "scheduled" && (
                        <button
                          className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md text-xs hover:opacity-90 transition"
                          onClick={() => handleExecute(c.ID)}
                        >
                          Execute
                        </button>
                      )}
 
                      {c.Status === "executed" && (
                        <button
                          onClick={() =>
                            navigate(`/campaign/${c.ID}/report`, { state: c })
                          }
                          className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-md text-xs hover:opacity-90 transition"
                        >
                          Report
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
      {showScheduleModal && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50">
    <div className="w-[480px] p-6 rounded-2xl bg-white/10 border border-white/20 shadow-2xl text-white backdrop-blur-xl">
      <h3 className="text-xl font-semibold mb-4 text-center">
        Schedule Campaign
      </h3>

      {/* Date + Time Picker Section */}
      <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-300">
          Select Date & Time
        </label>

        <div className="flex gap-4">

          {/* Calendar */}
          <DatePicker
            selected={scheduleAt}
            onChange={(date) => setScheduleAt(date)}
            inline
            calendarClassName="bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-xl p-2 shadow-xl"
            dayClassName={() =>
              "text-white hover:bg-purple-500/30 rounded-md transition"
            }
          />

          {/* Time Picker (AM/PM) */}
          <div className="flex flex-col justify-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 text-white w-32">
            <label className="text-xs text-gray-300 mb-1">Time</label>

            <DatePicker
              selected={scheduleAt}
              onChange={(time) => {
                if (!time) return;
                if (!scheduleAt) return setScheduleAt(time);

                const updated = new Date(scheduleAt);
                updated.setHours(time.getHours());
                updated.setMinutes(time.getMinutes());
                setScheduleAt(updated);
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={5}
              timeCaption="Time"
              dateFormat="h:mm aa"   // ✅ AM/PM Format
              className="w-full px-2 py-2 text-center bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              popperClassName="z-50"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowScheduleModal(false)}
          className="px-4 py-2 rounded-lg text-sm bg-gray-600/40 border border-white/20 hover:bg-gray-600/60 transition"
        >
          Cancel
        </button>

        <button
          onClick={confirmSchedule}
          className="px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 transition border border-white/20"
        >
          Confirm
        </button>
      </div>

    </div>
  </div>
)}


    </div>
  );
}