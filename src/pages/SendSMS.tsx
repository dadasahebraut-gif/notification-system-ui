/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { getApiUrl } from "../config/api";
import {
  PaperAirplaneIcon,
  ArrowLeftIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

interface Variable {
  name: string;
  type: "text" | "number";
  position: number;
}

const SendSMS: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);
  const { clientData } = useAppSelector((state) => state.client);

  const [selectedMedium, setSelectedMedium] = useState<"sms" | "whatsapp" | "">(
    ""
  );
  const [formData, setFormData] = useState({
    projectId: "",
    purposeId: "",
    mobile: "",
    message: "",
  });
  const [variableValues, setVariableValues] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");

  // Normalize backend responses so UI works whether backend sends { status/message } or { error }
  const responseMessage = response?.error || response?.message || "";
  const responseIsSuccess =
    !!response &&
    (response.status === "success" ||
      (!response.status && !response.error && !!response.message));

  if (!clientData || !clientData.Projects || clientData.Projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 lg:ml-[280px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            You need at least one project to send messages
          </h2>
          <button
            onClick={() => navigate("/create-project")}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-colors"
          >
            Create Project First
          </button>
        </div>
      </div>
    );
  }

  const selectedProject = clientData.Projects.find(
    (p) => p.ID === formData.projectId
  );
  console.log("selectedProject", selectedProject);
  const availablePurposes =
    selectedProject?.purposes?.filter((purpose) => {
      console.log("purpose", purpose);
      console.log("selectedMedium", selectedMedium);
      if (!selectedMedium) return true;

      try {
        const metadata = purpose.MetaData;
        console.log("metadata", metadata);
        const purposeMedium = metadata?.medium || "sms";

        return purposeMedium === selectedMedium;
      } catch {
        console.log("something went wrong");
        return selectedMedium === "sms"; // default to SMS if metadata parsing fails
      }
    }) || [];
  console.log("availablePurposes", availablePurposes);

  const selectedPurpose = availablePurposes.find(
    (p) => p.ID === formData.purposeId
  );
  const purposeVariables: Variable[] = selectedPurpose
    ? (() => {
        try {
          const metadata = selectedPurpose.MetaData || "{}";
          return metadata.variables || [];
        } catch {
          return [];
        }
      })()
    : [];

  const validateForm = () => {
    if (!selectedMedium) {
      setError("Please select a medium (SMS or WhatsApp)");
      return false;
    }
    if (!formData.projectId) {
      setError("Please select a project");
      return false;
    }
    if (!formData.mobile.trim()) {
      setError("Mobile number is required");
      return false;
    }

    if (selectedMedium === "sms" && !formData.message.trim()) {
      setError("Message is required for SMS");
      return false;
    }

    if (selectedMedium === "whatsapp") {
      if (!formData.purposeId) {
        setError("Purpose is required for WhatsApp");
        return false;
      }

      // Validate variable values
      for (const variable of purposeVariables) {
        const value = variableValues[variable.name];
        if (!value || !value.trim()) {
          setError(`${variable.name} is required`);
          return false;
        }

        if (variable.type === "number" && isNaN(Number(value))) {
          setError(`${variable.name} must be a number`);
          return false;
        }
      }
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    if (!selectedProject) {
      setError("Please select a project");
      setLoading(false);
      return;
    }

    try {
      let apiResponse;

      if (selectedMedium === "sms") {
        // SMS API call
        apiResponse = await fetch(getApiUrl("/sms"), {
          method: "POST",
          headers: {
            "X-CLIENT-ID": clientData.ID,
            "X-PROJECT-ID": formData.projectId,
            "X-API-KEY": selectedProject.APIKey || "",
            "X-PURPOSE-ID": formData.purposeId || formData.projectId,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mobile: formData.mobile,
            message: formData.message,
          }),
        });
      } else {
        // WhatsApp API call
        apiResponse = await fetch(getApiUrl("/whatsapp"), {
          method: "POST",
          headers: {
            "X-API-KEY": selectedProject.APIKey || "",
            "X-PURPOSE-ID": formData.purposeId,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: formData.mobile,
            variables: variableValues,
          }),
        });
      }

      const data = await apiResponse.json();
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
      setResponse({
        status: "error",
        message: "Failed to send message. Please check your connection.",
      });
    }
    setLoading(false);
  };

  const resetForm = () => {
    setSelectedMedium("");
    setFormData({ projectId: "", purposeId: "", mobile: "", message: "" });
    setVariableValues({});
    setResponse(null);
    setError("");
  };

  return (
    <div className="min-h-screen px-4 lg:px-8 py-8 lg:ml-[280px]">
      <div className="max-w-4xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/dashboard")}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <PaperAirplaneIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
            Send Message
          </h1>
          <p className="text-gray-400">Send notifications using your API</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl"
        >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {!response ? (
          <AnimatePresence mode="wait">
            (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Send Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Medium Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Select Medium *
                  </label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="medium"
                        value="sms"
                        checked={selectedMedium === "sms"}
                        onChange={(e) => {
                          setSelectedMedium(e.target.value as "sms");
                          setFormData({
                            projectId: "",
                            purposeId: "",
                            mobile: "",
                            message: "",
                          });
                          setVariableValues({});
                        }}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500/50 border-gray-600 bg-gray-700"
                      />
                      <DevicePhoneMobileIcon className="w-5 h-5 text-blue-400" />
                      <span className="text-white">SMS</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="medium"
                        value="whatsapp"
                        checked={selectedMedium === "whatsapp"}
                        onChange={(e) => {
                          setSelectedMedium(e.target.value as "whatsapp");
                          setFormData({
                            projectId: "",
                            purposeId: "",
                            mobile: "",
                            message: "",
                          });
                          setVariableValues({});
                        }}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500/50 border-gray-600 bg-gray-700"
                      />
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-400" />
                      <span className="text-white">WhatsApp</span>
                    </label>
                  </div>
                </div>
                {/* Project Select */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Select Project *
                  </label>
                  <select
                    required
                    value={formData.projectId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        projectId: e.target.value,
                        purposeId: "",
                      })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
                  >
                    <option value="" className="bg-gray-800">
                      Select a project
                    </option>
                    {clientData.Projects.map((project) => (
                      <option
                        key={project.ID}
                        value={project.ID}
                        className="bg-gray-800"
                      >
                        {project.Name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Details */}
                {selectedProject && (
                  <div className="bg-black/20 rounded-xl p-4 border border-orange-500/20">
                    <h3 className="text-sm font-semibold text-orange-300 mb-2">
                      Selected Project Details
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-gray-400">Project: </span>
                        <span className="text-white">
                          {selectedProject.Name}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">API Key: </span>
                        <span className="text-orange-400 font-mono text-xs">
                          {selectedProject.APIKey
                            ? selectedProject.APIKey.slice(0, 20) + "..."
                            : "Not available"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Purpose Select - Required for WhatsApp, Optional for SMS */}
                {availablePurposes.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Select Template{" "}
                      {selectedMedium === "whatsapp" ? "*" : "(Optional)"}
                    </label>
                    <select
                      required={selectedMedium === "whatsapp"}
                      value={formData.purposeId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          purposeId: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
                    >
                      <option value="" className="bg-gray-800">
                        {selectedMedium === "whatsapp"
                          ? "Select a purpose"
                          : "Use project default"}
                      </option>
                      {availablePurposes.map((purpose) => (
                        <option
                          key={purpose.ID}
                          value={purpose.ID}
                          className="bg-gray-800"
                        >
                          {purpose.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
                    placeholder={
                      selectedMedium === "whatsapp"
                        ? "918208709752"
                        : "8208709752"
                    }
                  />
                </div>

                {/* SMS Message */}
                {selectedMedium === "sms" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 h-32 resize-none"
                      placeholder="Type your message here..."
                      maxLength={160}
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">
                      {formData.message.length}/160 characters
                    </div>
                  </div>
                )}

                {/* WhatsApp Variables */}
                {selectedMedium === "whatsapp" &&
                  purposeVariables.length > 0 && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-green-300">
                          Template Variables
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {purposeVariables
                          .sort((a, b) => a.position - b.position)
                          .map((variable) => (
                            <div key={variable.name}>
                              <label className="block text-sm font-semibold text-gray-300 mb-2">
                                {variable.name} (Position {variable.position}) *
                              </label>
                              <input
                                type={
                                  variable.type === "number" ? "number" : "text"
                                }
                                required
                                value={variableValues[variable.name] || ""}
                                onChange={(e) =>
                                  setVariableValues({
                                    ...variableValues,
                                    [variable.name]: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                                placeholder={`Enter ${variable.name}`}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </form>
            </motion.div>
            )
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                response.status === "success"
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
              }`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-2xl ${
                  response.status === "success"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {response.status === "success" ? "✓" : "✗"}
              </motion.div>
            </div>

            <h2
              className={`text-2xl font-bold mb-4 ${
                responseIsSuccess ? "text-green-400" : "text-red-400"
              }`}
            >
              {responseIsSuccess
                ? `${selectedMedium?.toUpperCase()} Sent Successfully!`
                : `${selectedMedium?.toUpperCase()} Failed to Send`}
            </h2>

            <div className="bg-black/20 rounded-xl p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold text-gray-300 mb-3">
                Response Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 font-semibold">Message:</span>
                  <span className="text-red-500 font-bold text-l">
                    {responseMessage || "No response message"}
                  </span>
                </div>

                {response.data && (
                  <div>
                    <span className="text-gray-400">Data: </span>
                    <span className="text-white">{response.data}</span>
                  </div>
                )}
                {response.serverTime && (
                  <div>
                    <span className="text-gray-400">Server Time: </span>
                    <span className="text-white">
                      {new Date(response.serverTime).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetForm}
                className="flex-1 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
              >
                Send Another Message
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        {!response && selectedMedium && (
          <div className="mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5" />
                  <span>Send {selectedMedium?.toUpperCase()}</span>
                </>
              )}
            </motion.button>
          </div>
        )}
      </motion.div>
      </div>
    </div>
  );
};

export default SendSMS;
