import React from "react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
  progress?: number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  gradient,
  delay = 0,
  progress,
  trend,
  trendValue,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`bg-gradient-to-br ${gradient} backdrop-blur-lg rounded-3xl p-8 border border-white/20 relative overflow-hidden group shadow-2xl`}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm"
          >
            {icon}
          </motion.div>

          {trend && trendValue && (
            <div
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
                trend === "up"
                  ? "bg-green-500/20 text-green-300"
                  : trend === "down"
                  ? "bg-red-500/20 text-red-300"
                  : "bg-gray-500/20 text-gray-300"
              }`}
            >
              <span>{trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <motion.p
            className="text-4xl font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </motion.p>
          {subtitle && <p className="text-white/60 text-sm">{subtitle}</p>}
        </div>

        {progress !== undefined && (
          <div className="mt-6">
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-white h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                  delay: delay + 0.5,
                  duration: 1,
                  ease: "easeOut",
                }}
              />
            </div>
            <p className="text-white/60 text-xs mt-2">
              {progress.toFixed(1)}% utilized
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
