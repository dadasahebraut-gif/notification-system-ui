import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardDocumentIcon,
  CheckIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  KeyIcon,
  CalendarIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { Project } from "../../store/slices/clientSlice";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Parse metadata to get configurations
  const metadata = project.MetaData
    ? typeof project.MetaData === "string"
      ? project.MetaData
      : project.MetaData
    : null;
  const mediums = metadata?.mediums || [];
  const whatsappConfig = metadata?.whatsapp;
  const hasSMS = mediums.includes("sms") || project.SenderId;
  const hasWhatsApp = mediums.includes("whatsapp") || whatsappConfig;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 0.1 * index,
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 relative overflow-hidden group shadow-2xl"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 1, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full blur-xl"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
            }}
            animate={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl"
              >
                <KeyIcon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {project.Name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">
                    {new Date(project.CreatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.IsActive
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                {project.IsActive ? "Active" : "Inactive"}
              </span>

              {/* Medium badges */}
              {hasSMS && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1">
                  <DevicePhoneMobileIcon className="w-3 h-3" />
                  <span>SMS</span>
                </span>
              )}

              {hasWhatsApp && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30 flex items-center space-x-1">
                  <ChatBubbleLeftRightIcon className="w-3 h-3" />
                  <span>WhatsApp</span>
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">Project ID</p>
            <div className="flex items-center space-x-2">
              <code className="text-cyan-400 text-sm bg-black/30 px-3 py-1 rounded-lg border border-cyan-500/20">
                {project.ID.slice(0, 8)}...
              </code>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  copyToClipboard(project.ID, `project-${project.ID}`)
                }
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                {copiedKey === `project-${project.ID}` ? (
                  <CheckIcon className="w-4 h-4 text-green-400" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4 text-gray-400" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* API Key Section */}
        {project.APIKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-black/30 rounded-2xl p-6 mb-6 border border-cyan-500/20"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-cyan-300 flex items-center space-x-2">
                <KeyIcon className="w-5 h-5" />
                <span>API Key</span>
              </h4>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  copyToClipboard(project.APIKey!, `api-${project.ID}`)
                }
                className="p-2 bg-cyan-500/20 rounded-lg hover:bg-cyan-500/30 transition-colors"
              >
                {copiedKey === `api-${project.ID}` ? (
                  <CheckIcon className="w-4 h-4 text-green-400" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4 text-cyan-400" />
                )}
              </motion.button>
            </div>
            <code className="text-green-400 text-sm font-mono break-all block bg-black/20 p-3 rounded-lg">
              {project.APIKey}
            </code>
          </motion.div>
        )}

        {/* Configuration Sections */}
        <div className="space-y-6">
          {/* SMS Configuration */}
          {/* {hasSMS && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-blue-300 flex items-center space-x-2">
                  <DevicePhoneMobileIcon className="w-5 h-5" />
                  <span>SMS Configuration</span>
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Sender ID</span>
                  <div className="flex items-center space-x-2">
                    <code className="text-blue-400 text-sm bg-black/20 px-3 py-1 rounded-lg">
                      {project.SenderId || "Not configured"}
                    </code>
                    {project.SenderId && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          copyToClipboard(
                            project.SenderId,
                            `sender-${project.ID}`
                          )
                        }
                        className="p-1 bg-blue-500/20 rounded hover:bg-blue-500/30 transition-colors"
                      >
                        {copiedKey === `sender-${project.ID}` ? (
                          <CheckIcon className="w-3 h-3 text-green-400" />
                        ) : (
                          <ClipboardDocumentIcon className="w-3 h-3 text-blue-400" />
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )} */}

          {/* WhatsApp Configuration */}
          {hasWhatsApp && whatsappConfig && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-green-300 flex items-center space-x-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  <span>WhatsApp Configuration</span>
                </h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Phone Number ID</span>
                  <div className="flex items-center space-x-2">
                    <code className="text-green-400 text-sm bg-black/20 px-3 py-1 rounded-lg">
                      {whatsappConfig.phoneNumberId || "Not configured"}
                    </code>
                    {whatsappConfig.phoneNumberId && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          copyToClipboard(
                            whatsappConfig.phoneNumberId,
                            `phone-${project.ID}`
                          )
                        }
                        className="p-1 bg-green-500/20 rounded hover:bg-green-500/30 transition-colors"
                      >
                        {copiedKey === `phone-${project.ID}` ? (
                          <CheckIcon className="w-3 h-3 text-green-400" />
                        ) : (
                          <ClipboardDocumentIcon className="w-3 h-3 text-green-400" />
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Access Token</span>
                  <div className="flex items-center space-x-2">
                    <code className="text-green-400 text-sm bg-black/20 px-3 py-1 rounded-lg">
                      {whatsappConfig.accessToken
                        ? `${whatsappConfig.accessToken.slice(0, 20)}...`
                        : "Not configured"}
                    </code>
                    {whatsappConfig.accessToken && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          copyToClipboard(
                            whatsappConfig.accessToken,
                            `token-${project.ID}`
                          )
                        }
                        className="p-1 bg-green-500/20 rounded hover:bg-green-500/30 transition-colors"
                      >
                        {copiedKey === `token-${project.ID}` ? (
                          <CheckIcon className="w-3 h-3 text-green-400" />
                        ) : (
                          <ClipboardDocumentIcon className="w-3 h-3 text-green-400" />
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
