import React from "react";
import { motion } from "framer-motion";

interface QuotaChartProps {
  used: number;
  total: number;
  label: string;
  color: string;
  icon: React.ReactNode;
}

const QuotaChart: React.FC<QuotaChartProps> = ({
  used,
  total,
  label,
  color,
  icon,
}) => {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  const remaining = total - used;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`bg-gradient-to-br ${color} backdrop-blur-xl h-full rounded-3xl p-8 border border-white/20 relative overflow-hidden group shadow-2xl`}
    >
      {/* Background animation */}
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

      <div className="relative z-10 ">
        <div className="flex items-center justify-between ">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm"
          >
            {icon}
          </motion.div>

          <div className="text-right">
            <p className="text-white/80 text-sm font-medium">{label}</p>
            <motion.p
              className="text-3xl font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              {remaining.toLocaleString()}
            </motion.p>
            <p className="text-white/60 text-sm">remaining</p>
          </div>
        </div>

        {/* Circular Progress */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg
              className="w-32 h-32 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.p
                  className="text-2xl font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  {percentage.toFixed(0)}%
                </motion.p>
                <p className="text-white/60 text-xs">used</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-black/20 rounded-xl p-4">
            <p className="text-white/60 text-xs mb-1">Used</p>
            <p className="text-white font-bold">{used.toLocaleString()}</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4">
            <p className="text-white/60 text-xs mb-1">Total</p>
            <p className="text-white font-bold">{total.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuotaChart;
