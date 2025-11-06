import React from "react";
import { motion } from "framer-motion";
import {
  BuildingOfficeIcon,
  CalendarIcon,
  CheckBadgeIcon,
  UserIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { ClientData } from "../../store/slices/clientSlice";

interface ClientInfoCardProps {
  client: ClientData;
  userEmail?: string;
}

const ClientInfoCard: React.FC<ClientInfoCardProps> = ({
  client,
  userEmail,
}) => {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ y: -5, scale: 1.01 }}
      className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-8 border border-indigo-500/30 relative overflow-hidden shadow-2xl"
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 1, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
            }}
            animate={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl"
          >
            <BuildingOfficeIcon className="w-8 h-8 text-white" />
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2"
          >
            <CheckBadgeIcon className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm font-semibold">
              Verified Client
            </span>
          </motion.div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
              {client.Name}
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              {client.Description}
            </p>
          </div>

          {/* Client Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-indigo-400" />
                    <span className="text-gray-400 text-sm">Client ID</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyToClipboard(client.ID, "client-id")}
                    className="p-1 bg-indigo-500/20 rounded hover:bg-indigo-500/30 transition-colors"
                  >
                    {copiedKey === "client-id" ? (
                      <CheckIcon className="w-3 h-3 text-green-400" />
                    ) : (
                      <ClipboardDocumentIcon className="w-3 h-3 text-indigo-400" />
                    )}
                  </motion.button>
                </div>
                <code className="text-indigo-400 text-sm font-mono">
                  {client.ID}
                </code>
              </div>

              {userEmail && (
                <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <UserIcon className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-400 text-sm">Account Email</span>
                  </div>
                  <p className="text-purple-400 text-sm">{userEmail}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <CalendarIcon className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-400 text-sm">Created</span>
                </div>
                <p className="text-cyan-400 text-sm">
                  {new Date(client.CreatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckBadgeIcon className="w-4 h-4 text-green-400" />
                  <span className="text-gray-400 text-sm">Status</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    client.IsActive
                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  {client.IsActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientInfoCard;
