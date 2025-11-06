import React from "react";
import { motion } from "framer-motion";
import { ChartBarIcon } from "@heroicons/react/24/outline";

interface DashboardHeaderProps {
  clientName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ clientName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-16"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full mb-8 relative overflow-hidden"
      >
        <ChartBarIcon className="w-14 h-14 text-white" />

        {/* Rotating ring */}
        <motion.div
          className="absolute inset-2 border-2 border-white/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating particles around icon */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
            }}
            animate={{
              x: Math.cos((i * 45 * Math.PI) / 180) * 50,
              y: Math.sin((i * 45 * Math.PI) / 180) * 50,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
      >
        Welcome back, {clientName}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
      >
        Monitor your notification campaigns, track usage analytics, and manage
        your projects from your centralized dashboard.
      </motion.p>

      {/* Animated underline */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
        className="h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-6 rounded-full"
      />
    </motion.div>
  );
};

export default DashboardHeader;
