// src/pages/CampaignReport.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { RocketLaunchIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { getApiUrl, API_CONFIG } from "../config/api";
import * as XLSX from "xlsx";

interface FailedRecipient {
  ID: string;
  ClientID: string;
  ProjectID: string;
  PurposeID: string;
  CampaignID: string;
  Channel: string;
  ChannelConfigId: string;
  Recipient: string;
  IsBilled: boolean;
  TemplateID: string;
  Payload: {
    mobile: string;
    message: string;
    senderid: string;
  };
  Status: string;
  ErrorMessage: string;
  RetryCount: number;
  TransactionID: string;
  SentAt: string | null;
  CreatedAt: string;
}

interface CampaignReportData {
  status: string;
  message: string;
  data: {
    campaign_id: string;
    campaign_name: string;
    campaign_description: string;
    message_payload: string;
    total_notifications: number;
    failed_notifications: number;
    successful_notifications: number;
    accepted_notifications: number;
    failed_recipients: FailedRecipient[];
  };
}

const CampaignReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<CampaignReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleDownloadExcel = () => {
    if (!report) {
      alert("No campaign data available!");
      return;
    }

    const { status, message, data } = report;

    // ✅ Sheet 1: Campaign Summary
    const campaignSummary = [
      ["Status", status],
      ["Message", message],
      ["Campaign ID", data.campaign_id],
      ["Campaign Name", data.campaign_name],
      ["Description", data.campaign_description],
      ["Message Payload", data.message_payload],
      ["Total Notifications", data.total_notifications],
      ["Successful Notifications", data.successful_notifications],
      ["Failed Notifications", data.failed_notifications],
      ["Accepted Notifications", data.accepted_notifications],
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(campaignSummary);

    // ✅ Sheet 2: Full Failed Recipients
    const failedRecipients =
      data.failed_recipients && data.failed_recipients.length > 0
        ? data.failed_recipients.map((r, index) => ({
            "S.No": index + 1,
            ID: r.ID || "—",
            ClientID: r.ClientID,
            ProjectID: r.ProjectID,
            PurposeID: r.PurposeID,
            CampaignID: r.CampaignID,
            Channel: r.Channel,
            ChannelConfigId: r.ChannelConfigId,
            Recipient: r.Recipient,
            "Is Billed": r.IsBilled ? "Yes" : "No",
            TemplateID: r.TemplateID || "—",
            "Payload Mobile": r.Payload?.mobile || "—",
            "Payload Message": r.Payload?.message || "—",
            "Payload SenderID": r.Payload?.senderid || "—",
            Status: r.Status,
            "Error Message": r.ErrorMessage || "—",
            "Retry Count": r.RetryCount,
            "Transaction ID": r.TransactionID,
            "Sent At": r.SentAt || "—",
            "Created At": r.CreatedAt,
          }))
        : [{ Note: "No failed recipients 🎉" }];

    const wsFailed = XLSX.utils.json_to_sheet(failedRecipients);

    // ✅ Create Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsSummary, "Campaign Summary");
    XLSX.utils.book_append_sheet(wb, wsFailed, "Failed Recipients");

    // ✅ Save File
    const fileName = `${data.campaign_name || "campaign"}_${data.campaign_id}_report.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const url = `${getApiUrl(API_CONFIG.ENDPOINTS.CAMPAIGN)}/report/${id}`;

    axios
      .get(url)
      .then((res) => {
        if (res.data.status === "success") {
          setReport(res.data);
        } else {
          console.error("Failed to fetch report:", res.data.message);
        }
      })
      .catch((err) => console.error("Error fetching campaign report:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-300 text-lg">
        Loading report...
      </div>
    );

  if (!report)
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-gray-400">
        <XCircleIcon className="w-10 h-10 mb-3 text-red-500" />
        <p>Unable to load campaign report.</p>
      </div>
    );

  const data = report.data;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-6 py-10 border-white/10 bg-white/5 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl backdrop-blur-xl border border-white/10 bg-white/5 rounded-2xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-white flex items-center gap-2">
            <RocketLaunchIcon className="w-8 h-8 text-purple-400" />
            Campaign Report
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 px-5 py-2 rounded-md text-white transition"
          >
            Back
          </button>
        </div>

        {/* Campaign Info */}
        <div className="space-y-4 text-gray-300 mb-8">
          <p>
            <span className="font-semibold">Campaign ID:</span>{" "}
            {data.campaign_id}
          </p>
          <p>
            <span className="font-semibold">Campaign Name:</span>{" "}
            {data.campaign_name}
          </p>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {data.campaign_description}
          </p>
          <p>
            <span className="font-semibold">Message Payload:</span>{" "}
            {data.message_payload || "N/A"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total", value: data.total_notifications, color: "text-purple-400" },
            { label: "Success", value: data.successful_notifications, color: "text-green-400" },
            { label: "Failed", value: data.failed_notifications, color: "text-red-400" },
            { label: "Accepted", value: data.accepted_notifications, color: "text-yellow-400" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/5 p-4 rounded-lg text-center border border-white/10"
            >
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className={`text-xl font-semibold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Failed Recipients */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-300 text-center">
            Failed Recipients
          </h3>

          {(!data.failed_recipients || data.failed_recipients.length === 0) ? (
            <p className="text-gray-400 text-center">No failed recipients found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-white">
                <thead>
                  <tr className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-gray-300 uppercase text-xs tracking-wide">
                    <th className="border border-white/10 px-3 py-3 text-left rounded-tl-lg">
                      Mobile Number
                    </th>
                    <th className="border border-white/10 px-3 py-3 text-left rounded-tr-lg">
                      Error Message
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.failed_recipients.map((r, index) => (
                    <tr
                      key={index}
                      className="border-t border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="px-4 py-3 text-white">{r.Recipient}</td>
                      <td className="px-4 py-3 text-red-400">
                        {r.ErrorMessage || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Download Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleDownloadExcel}
            className="bg-gradient-to-r from-green-600 to-cyan-600 hover:opacity-90 px-5 py-2 rounded-md text-white transition"
          >
            Download Excel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CampaignReport;
