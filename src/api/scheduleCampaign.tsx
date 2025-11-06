import { API_CONFIG } from "../config/api";

export async function scheduleCampaign(campaignId: string, scheduleAt: string) {
  try {
    const storedKeys = localStorage.getItem("api_keys");
    let apiKey = "";

    if (storedKeys) {
      const parsedKeys = JSON.parse(storedKeys);
      const firstKey = Object.values(parsedKeys)[0];
      apiKey = firstKey as string;
    }

    if (!apiKey) {
      throw new Error("API key not found in local storage");
    }

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CAMPAIGN}/sms/schedule`, // ❌ no query
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          campaign_id: campaignId,   // ✅ send in body
          schedule_at: scheduleAt,   // ✅ send in body
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to schedule campaign");
    }

    const data = await response.json();
    console.log("Campaign scheduled successfully:", data);
    return data;
  } catch (error) {
    console.error("Error scheduling campaign:", error);
    throw error;
  }
}
