import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { motion } from "framer-motion";
import {
  CalendarIcon,
  RocketLaunchIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { executeCampaign } from "../api/ExecuteCampaign";
import { scheduleCampaign } from "../api/scheduleCampaign";
const CampaignVerification: React.FC = () => {
  useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleAt, setScheduleAt] = useState<Date | null>(new Date());

 
  useEffect(() => {
    const stored = localStorage.getItem("campaignData");
    if (stored) {
      setCampaign(JSON.parse(stored));
    } else {
      console.warn("No campaign data found in localStorage.");
    }
  }, []);
 
  // 🔹 Function to handle campaign execution
  const handleExecute = async () => {
    if (!campaign?.campaign_id) return;
    try {
      setLoading(true);
      setLoadingMessage("Executing campaign...");
      await executeCampaign(campaign.campaign_id);
      setLoadingMessage("Campaign executed successfully!");
      setTimeout(() => navigate("/campaign-list"), 800);
    } catch (error) {
      setLoadingMessage("Failed to execute campaign. Please try again.");
      console.error(error);
      setTimeout(() => setLoading(false), 1500);
    }
  };
 
  // 🔹 Function to handle scheduling
  const handleSchedule = async () => {
  if (!campaign?.campaign_id || !scheduleAt) {
    alert("Please select date & time first.");
    return;
  }

  try {
    setLoading(true);
    setLoadingMessage("Scheduling campaign...");

    await scheduleCampaign(campaign.campaign_id, scheduleAt.toISOString());

    setLoadingMessage("Campaign scheduled successfully!");
    setTimeout(() => navigate("/campaign-list"), 800);
  } catch (error) {
    setLoadingMessage("Failed to schedule campaign.");
    console.error(error);
    setTimeout(() => setLoading(false), 1500);
  }
};

 
  if (!campaign)
    return <div className="text-white p-6">Loading campaign...</div>;
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-6 text-white relative"
    >
      <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-7">
        Verify Campaign
      </h1>
 
      {/* Campaign Details Card */}
      <div className="backdrop-blur-xl border-white/10 bg-white/5 p-6 rounded-2xl shadow-2xl space-y-3">
        <p>
          <strong>Campaign ID :</strong> {campaign.campaign_id}
        </p>
        <p>
          <strong>Valid Numbers :</strong> {campaign.valid_numbers ?? "—"}
        </p>
        <p>
          <strong>Invalid Numbers :</strong> {campaign.invalid_numbers ?? "—"}
        </p>
        <p>
          <strong>Status :</strong> Success
        </p>
      </div>
 
      {/* Buttons */}
      <div className="mt-6 flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExecute}
          disabled={loading}
          className="px-5 py-3 bg-green-500/20 border border-green-500/40 rounded-lg text-green-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RocketLaunchIcon className="w-5 h-5" />
          <span>Execute Now</span>
        </motion.button>
 
      <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowScheduleModal(true)}
      disabled={loading}
      className="px-5 py-3 bg-blue-500/20 border border-blue-500/40 rounded-lg text-blue-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <CalendarIcon className="w-5 h-5" />
      <span>Schedule</span>
    </motion.button>

 
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/campaign-list")}
          disabled={loading}
          className="px-5 py-3 bg-gray-500/20 border border-gray-500/40 rounded-lg text-gray-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ClockIcon className="w-5 h-5" />
          <span>Skip for Now</span>
        </motion.button>
      </div>
      {showScheduleModal && (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50">
        <div className="w-[480px] p-6 rounded-2xl bg-white/10 border border-white/20 shadow-2xl text-white backdrop-blur-xl">

          <h3 className="text-xl font-semibold mb-4 text-center">Schedule Campaign</h3>
          <p className="text-xs font-semibold mb-4 text-center text-red-500">Note- your campaign will execute one minute after selected scheduled time.</p>

          <div className="flex gap-4 justify-center">
            <DatePicker
              selected={scheduleAt}
              onChange={(date) => setScheduleAt(date)}
              inline
              calendarClassName="bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-xl p-2 shadow-xl"
              dayClassName={() => "text-white hover:bg-purple-500/30 rounded-md transition"}
            />

            <div className="flex flex-col justify-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 text-white w-32">
              <label className="text-xs text-gray-300 mb-1">Time</label>

              <DatePicker
                selected={scheduleAt}
                onChange={(time: Date | null) => {
              if (!time) return; // <- stop the crying

              if (!scheduleAt) return setScheduleAt(time);

              const updated = new Date(scheduleAt);
              updated.setHours(time.getHours());
              updated.setMinutes(time.getMinutes());
              setScheduleAt(updated);
            }}

                showTimeSelect
                showTimeSelectOnly
                timeIntervals={5}
                dateFormat="HH:mm"
                className="w-full px-2 py-2 text-center bg-white/10 border border-white/30 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="px-4 py-2 rounded-lg text-sm bg-gray-600/40 border border-white/20 hover:bg-gray-600/60 transition"
            >
              Cancel
            </button>

            <button
              onClick={() => { setShowScheduleModal(false); handleSchedule(); }}
              className="px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 transition border border-white/20"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}

      {/* 🔹 Full-screen Loader Overlay */}
      {loading && (
  // 1. Full-screen invisible container for centering and covering the viewport
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl shadow-2xl border border-white/20 bg-white/10 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-400 border-solid mb-4"></div>
          
          <p className="text-lg text-cyan-300 font-semibold text-center">
              {loadingMessage}
         </p>
        </div>
      </div>
)}
    </motion.div>
  );
};
 
export default CampaignVerification;