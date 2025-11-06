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
  ScheduledAt?: string; // ✅ Add this optional field

}

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null
  );
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
          API_CONFIG.BASE_URL +
            `${API_CONFIG.ENDPOINTS.CAMPAIGN}/List?clientId=${clientId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch campaign list");
        }

        const data = await response.json();

        if (data?.data) {
        const mappedCampaigns = data.data.map((c: any) => ({
          ...c,
          ScheduledAt: c.ScheduleAt || null, // ✅ match backend field
        }));
        setCampaigns(mappedCampaigns);

      }

        
        else {
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

  const handleCancelSchedule = async (campaignId: string, scheduleAt: Date) => {
    try {
      setActionLoading(true);
      setLoadingMessage("Cancelling scheduled campaign...");

      const storedKeys = localStorage.getItem("api_keys");
      let apiKey = "";
      if (storedKeys) {
        const parsedKeys = JSON.parse(storedKeys);
        const firstKey = Object.values(parsedKeys)[0];
        apiKey = firstKey as string;
      }

      if (!apiKey) throw new Error("API key not found");

      const res = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CAMPAIGN}/sms/schedule/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": apiKey,
            "X-PURPOSE-ID": localStorage.getItem("client_id") || "",
          },
          body: JSON.stringify({
            campaign_id: campaignId,
            schedule_at: scheduleAt.toISOString(),
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to cancel scheduled campaign");

      setLoadingMessage("Campaign schedule cancelled!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error(err);
      setLoadingMessage("Failed to cancel schedule.");
      setTimeout(() => setActionLoading(false), 1500);
    }
  };


  return (
    <div className="min-h-screen p-6 lg:ml-[280px]">
      <div className="max-w-7xl mx-auto">
        {/* Loader Overlay */}
        {actionLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 text-white text-center space-y-4"
            >
              <div className="w-12 h-12 border-4 border-t-purple-400 border-white/20 rounded-full animate-spin mx-auto" />
              <p className="text-lg font-medium">{loadingMessage}</p>
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl border border-white/10 bg-white/5 rounded-2xl shadow-2xl p-8"
        >
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">
            Campaign List
          </h2>

          {loading ? (
            <p className="text-gray-400 text-center">Loading campaigns...</p>
          ) : campaigns.length === 0 ? (
            <p className="text-gray-400 text-center">No campaigns found.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full text-sm text-white">
                <thead>
                  <tr className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-white/10">
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                      Campaign Name
                    </th>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-gray-300 font-semibold">
                      Total
                    </th>
                    <th className="px-6 py-4 text-center text-gray-300 font-semibold">
                      Created
                    </th>
                    <th className="px-6 py-4 text-center text-gray-300 font-semibold">
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
                      className="hover:bg-white/5 transition-all duration-200 border-b border-white/5"
                    >
                      <td className="px-6 py-4 font-medium">{c.Name}</td>
                      <td className="px-6 py-4 capitalize">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            c.Status === "executed"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : c.Status === "scheduled"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : c.Status === "draft"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }`}
                        >
                          {c.Status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {c.TotalCount || 0}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-300">
                        {c.CreatedAt
                          ? new Date(c.CreatedAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
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
                        <div className="flex gap-2 justify-center">
                          <button
                            className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md text-xs hover:opacity-90 transition"
                            onClick={() => handleExecute(c.ID)}
                          >
                            Execute
                          </button>
                          <button
                            className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-md text-xs hover:opacity-90 transition"
                            onClick={() => {
                              if (!c.ScheduledAt) {
                                alert("Scheduled date not found!");
                                return;
                              }
                              handleCancelSchedule(c.ID, new Date(c.ScheduledAt));
                            }}
                          >
                            Cancel
                          </button>

                        </div>
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
                      dateFormat="h:mm aa" // ✅ AM/PM Format
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
    </div>
  );
}
