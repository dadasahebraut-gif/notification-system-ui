import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useAppSelector } from "../hooks/redux";
import { API_CONFIG, getApiUrl } from "../config/api";

const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [campaignName, setCampaignName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [purposeId, setPurposeId] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [purposes, setPurposes] = useState<{ id: string; name: string }[]>([]);
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useAppSelector((state) => state.auth);

  // 🔹 Fetch client details and extract projects with purposes
 useEffect(() => {
  const clientId = localStorage.getItem("client_id");
  if (!clientId) return;

  const fetchProjects = async () => {
    try {
      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.CLIENTS)}/${clientId}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const projectsList = res.data?.data?.Projects || [];
      if (projectsList.length > 0) {
        const projectsData = projectsList.map((proj: any) => ({
          id: proj.ID,
          name: proj.Name,
          purposes:
            proj.Purposes?.map((p: any) => ({
              id: p.ID,
              name: p.Name,
            })) || [],
        }));

        setProjectsData(projectsData);
        setProjects(projectsData.map((p) => ({ id: p.id, name: p.name })));

        // ✅ Set first project & purposes after state updates
        const firstProject = projectsData[0];
        if (firstProject) {
          // Use setTimeout to ensure select value updates after re-render
          setTimeout(() => {
            setProjectId(firstProject.id);
            setPurposes(firstProject.purposes || []);
          }, 0);
        }
      } else {
        console.warn("No projects found for this client.");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  fetchProjects();
}, [token]);


  // 🔹 Handle Project Change → Filter Purposes
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setProjectId(selectedId);
    const selectedProject = projectsData.find((p) => p.id === selectedId);
    setPurposes(selectedProject?.purposes || []);
    setPurposeId(""); // reset purpose when project changes
  };

  // 🔹 Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!campaignName.trim() || !file || !projectId || !purposeId) {
      setError("Please provide campaign name, project, template, and Excel file.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("campaign_name", campaignName);
      formData.append("project_id", projectId);
      formData.append("purpose_id", purposeId);
      formData.append("description", description);
      formData.append("client_id", localStorage.getItem("client_id") || "");
      formData.append("file", file);

      const url =`${getApiUrl(API_CONFIG.ENDPOINTS.CAMPAIGN)}/upload`;


      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data?.data || response.data;

      localStorage.setItem("campaignData", JSON.stringify(data));

      setResult(data);
      setStep(2);

      setTimeout(() => {
        navigate(`/verify-campaign/${data.campaign_id}`);
      }, 2000);
    } catch (err: any) {
        console.error("Error creating campaign:", err);
 
        // Try to extract the backend error message
        const backendMsg =
          err.response?.data?.error || err.response?.data?.message || err.message;
 
        setError(backendMsg || "Something went wrong while creating campaign.");
      } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4 mt-4">
          Create New Campaign
        </h2>

        <div className="flex items-center justify-center">
          {[1, 2].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  step >= stepNum
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                    : "bg-gray-800 text-gray-500"
                }`}
              >
                {step > stepNum ? "✓" : stepNum}
              </div>
              {stepNum < 2 && (
                <div
                  className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    step > stepNum
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500"
                      : "bg-gray-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl border border-white/10 bg-white/5 rounded-xl p-8 shadow-2xl w-full max-w-xl"
      >
        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-300 mb-2">Campaign Name *</label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Enter campaign name"
              />
            </div>

            {/* Project Dropdown */}
            <div>
              <label className="block text-gray-300 mb-2">Select Project *</label>
              <select
                value={projectId}
                onChange={handleProjectChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 transition-all duration-300"
              >
                <option value="" className="bg-gray-900">
                  Select Project
                </option>
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <option
                      key={project.id}
                      value={project.id}
                      className="bg-gray-900 text-white"
                    >
                      {project.name}
                    </option>
                  ))
                ) : (
                  <option disabled className="bg-gray-900">
                    No projects found
                  </option>
                )}
              </select>
            </div>

            {/* Purpose Dropdown */}
            <div>
              <label className="block text-gray-300 mb-2">Select Template *</label>
              <select
                value={purposeId}
                onChange={(e) => setPurposeId(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
              >
                <option value="" className="bg-gray-900">
                  Select Template
                </option>
                {purposes.length > 0 ? (
                  purposes.map((p) => (
                    <option
                      key={p.id}
                      value={p.id}
                      className="bg-gray-900 text-white"
                    >
                      {p.name}
                    </option>
                  ))
                ) : (
                  <option disabled className="bg-gray-900">
                    No template found
                  </option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Campaign Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Enter description"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Upload Excel File *</label>
              <label className="block text-gray-400 mb-2 text-xs">The file must contain column mobile_number</label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-cyan-600 file:to-purple-600 file:text-white hover:file:opacity-90 text-gray-400 cursor-pointer w-full bg-white/5 border border-white/10 rounded-xl p-2"
              />
              {file && (
                <p className="mt-2 text-sm text-cyan-400">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-lg font-medium relative"
            >
              {loading ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <span>Create Campaign</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </motion.button>

          </form>
        )}

        {/* Step 2 */}
        {step === 2 && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-4"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
              <div className="text-green-400 text-2xl">✓</div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Campaign Created Successfully!
            </h2>
            <p className="text-gray-300 mb-3">
              Valid: <b>{result.valid_numbers}</b> | Invalid:{" "}
              <b>{result.invalid_numbers}</b>
            </p>
            <p className="text-gray-500 mb-6 text-sm">
              Redirecting to verification page...
            </p>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CreateCampaign;