import { API_CONFIG } from "../config/api";

export async function executeCampaign(campaignId: string) {
  try {
    // 🔹 Get all stored API keys
    const storedKeys = localStorage.getItem("api_keys");
    let apiKey = "";

    if (storedKeys) {
      const parsedKeys = JSON.parse(storedKeys);
      const firstKey = Object.values(parsedKeys)[0]; // Get first API key value
      apiKey = firstKey as string;
    }

    if (!apiKey) {
      throw new Error("API key not found in local storage");
    }

    // 🔹 Make the API request
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CAMPAIGN}/sms/execute?campaign_id=${campaignId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey, // ✅ Send key in header
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to execute campaign");
    }

    const data = await response.json();
    console.log("Campaign executed successfully:", data);
    return data;
  } catch (error) {
    console.error("Error executing campaign:", error);
    throw error;
  }
}
