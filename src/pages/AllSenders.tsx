import React, { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl, API_CONFIG } from "../config/api";

const AllSenders: React.FC = () => {
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

        const url = `${getApiUrl(API_CONFIG.ENDPOINTS.SENDERS)}/filter?client_id=${clientId}`;
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

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-white mb-4">All Senders</h2>
      {senders.length === 0 ? (
        <p className="text-gray-400">No senders found.</p>
      ) : (
        <table className="w-full text-sm text-left border border-white/10 rounded-xl overflow-hidden">
          <thead className="bg-white/10 text-gray-300">
            <tr>
              <th className="px-4 py-3">Sender ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">DLT Entity</th>
              <th className="px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {senders.map((sender, index) => (
              <tr key={index} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-3 text-white">{sender.SenderId}</td>
                <td className="px-4 py-3 text-gray-300">{sender.Type}</td>
                <td className="px-4 py-3 text-gray-400">{sender.DLTEntityPrincipallID || "—"}</td>
                <td className="px-4 py-3 text-gray-300">
                  {sender.IsActive ? (
                    <span className="text-green-400">Active</span>
                  ) : (
                    <span className="text-red-400">Inactive</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllSenders;