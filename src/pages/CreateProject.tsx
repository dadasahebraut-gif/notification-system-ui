/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../config/api";
import {
  RocketLaunchIcon,
  ArrowLeftIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { addProject } from "../store/slices/clientSlice";

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { token, clientId } = useAppSelector((state) => state.auth);

  // const client = useAppSelector((state) => state.client.clientData);
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId || !token) return;

      try {
        const response = await fetch(getApiUrl(`/clients/${clientId}`), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.status === "success") {
          // dispatch(setClientData(data.data));
          setClient(data.data);
        } else {
          setError(data.message || "Failed to fetch client data");
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        setError("Failed to fetch client data");
      }
    };

    fetchClientData();
  }, [clientId, token, dispatch]);
  const [step, setStep] = useState(1); // 1: Medium Selection, 2: Project Details
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    projectName: "",
    // senderId: "",
    phoneNumberId: "",
    accessToken: "",
  });
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState("");

  const mediumOptions = [
    {
      id: "sms",
      name: "SMS",
      icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      description: "Send SMS notifications",
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      description: "Send WhatsApp messages",
    },
  ];

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Please register as a client first
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-colors"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  const handleMediumToggle = (mediumId: string) => {
    setSelectedMediums((prev) => {
      const newSelection = prev.includes(mediumId)
        ? prev.filter((id) => id !== mediumId)
        : [...prev, mediumId];
      return newSelection;
    });
    setError("");
  };

  const validateStep1 = () => {
    if (selectedMediums.length === 0) {
      setError("Please select at least one medium (SMS or WhatsApp)");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    if (!formData.projectName.trim()) {
      setError("Project name is required");
      return false;
    }

    // if (selectedMediums.includes("sms") && !formData.senderId.trim()) {
    //   setError("Sender ID is required for SMS");
    //   return false;
    // }

    if (selectedMediums.includes("whatsapp")) {
      if (!formData.phoneNumberId.trim()) {
        setError("Phone Number ID is required for WhatsApp");
        return false;
      }
      if (!formData.accessToken.trim()) {
        setError("Access Token is required for WhatsApp");
        return false;
      }
    }

    setError("");
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setLoading(true);

    try {
      // Prepare metadata for WhatsApp
      let metadata: any = {
        mediums: selectedMediums,
      };

      if (selectedMediums.includes("whatsapp")) {
        metadata = {
          mediums: selectedMediums,
          phoneNumberId: formData.phoneNumberId,
          accessToken: formData.accessToken,
        };
      }

      const payload: any = {
        name: formData.projectName,
        client_id: client.ID,
        metadata: metadata,
      };

      // Add sender_id only if SMS is selected
      if (selectedMediums.includes("sms")) {
        payload.sender_id = formData.senderId;
      }

      const response = await fetch(getApiUrl("/projects"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setApiResponse(data);

      if (data.status === "success") {
        const newProject = {
          ID: data.data.project_id,
          ClientID: client.ID,
          Name: formData.projectName,
          APIKey: data.data.api_key,
          // SenderId: formData.senderId || null,
          MetaData: metadata,
          IsActive: true,
          CreatedAt: data.data.created_at,
          UpdatedAt: data.data.created_at,
          purposes: [],
        };

        dispatch(addProject(newProject));
        setTimeout(() => navigate("/dashboard"), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to create project. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-4">
          <RocketLaunchIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Create New Project
        </h1>
        <p className="text-gray-400">
          Add a new project to your {client.Name} workspace
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                step >= stepNum
                  ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              {step > stepNum ? (
                <CheckCircleIcon className="w-6 h-6" />
              ) : (
                stepNum
              )}
            </div>
            {stepNum < 2 && (
              <div
                className={`w-16 h-1 mx-2 transition-all duration-300 ${
                  step > stepNum
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500"
                    : "bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

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

        {!apiResponse ? (
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  Choose Communication Medium
                </h2>
                <p className="text-gray-400 mb-6">
                  Select which notification channels this project will use
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {mediumOptions.map((medium) => (
                    <motion.div
                      key={medium.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMediumToggle(medium.id)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedMediums.includes(medium.id)
                          ? `border-transparent bg-gradient-to-r ${medium.color} bg-opacity-20`
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${medium.color}`}
                        >
                          {medium.icon}
                        </div>
                        {selectedMediums.includes(medium.id) && (
                          <CheckCircleIcon className="w-6 h-6 text-green-400" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {medium.name}
                      </h3>
                      <p className="text-gray-400">{medium.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  Project Configuration
                </h2>
                <p className="text-gray-400 mb-6">
                  Configure your project settings
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.projectName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          projectName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200"
                      placeholder="Enter your project name"
                    />
                  </div>

                  {/* SMS Configuration
                  {selectedMediums.includes("sms") && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <DevicePhoneMobileIcon className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-blue-300">
                          SMS Configuration
                        </h3>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Sender ID *
                        </label>
                        <input
                          type="text"
                          required={selectedMediums.includes("sms")}
                          value={formData.senderId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              senderId: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                          placeholder="Enter your SMS sender ID"
                        />
                      </div>
                    </div>
                  )} */}

                  {/* WhatsApp Configuration */}
                  {selectedMediums.includes("whatsapp") && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-green-300">
                          WhatsApp Configuration
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Phone Number ID *
                          </label>
                          <input
                            type="text"
                            required={selectedMediums.includes("whatsapp")}
                            value={formData.phoneNumberId}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phoneNumberId: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                            placeholder="Enter WhatsApp Phone Number ID"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Access Token *
                          </label>
                          <input
                            type="text"
                            required={selectedMediums.includes("whatsapp")}
                            value={formData.accessToken}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                accessToken: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                            placeholder="Enter WhatsApp Access Token"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-black/20 rounded-xl p-4 border border-cyan-500/20">
                    <h3 className="text-sm font-semibold text-cyan-300 mb-2">
                      Client Information
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-gray-400">Client: </span>
                        <span className="text-white">{client.Name}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Client ID: </span>
                        <span className="text-cyan-400 font-mono">
                          {client.ID}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">
                          Selected Mediums:{" "}
                        </span>
                        <span className="text-white">
                          {selectedMediums.join(", ").toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-green-400 text-2xl"
              >
                ✓
              </motion.div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              Project Created Successfully!
            </h2>

            <div className="bg-black/20 rounded-xl p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                Your New Project Details
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Project Name: </span>
                  <span className="text-white font-semibold">
                    {formData.projectName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Project ID: </span>
                  <span className="text-white font-mono">
                    {apiResponse.data.project_id}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">API Key: </span>
                  <span className="text-green-400 font-mono break-all">
                    {apiResponse.data.api_key}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Mediums: </span>
                  <span className="text-white">
                    {selectedMediums.join(", ").toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Created: </span>
                  <span className="text-white">
                    {new Date(apiResponse.data.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-4">Redirecting to dashboard...</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
              />
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        {!apiResponse && (
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {step < 2 ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
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
                    <RocketLaunchIcon className="w-5 h-5" />
                    <span>Create Project</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CreateProject;
