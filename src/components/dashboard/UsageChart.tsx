import React from "react";
import { motion } from "framer-motion";
import {
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

interface UsageData {
  sms: { used: number; total: number };
  whatsapp: { used: number; total: number };
}

interface UsageChartProps {
  data: UsageData;
}

const UsageChart: React.FC<UsageChartProps> = ({ data }) => {
  // Percentages
  const smsPercentage =
    data.sms.total > 0 ? (data.sms.used / data.sms.total) * 100 : 0;
  const whatsappPercentage =
    data.whatsapp.total > 0
      ? (data.whatsapp.used / data.whatsapp.total) * 100
      : 0;

  // Each bar is always 100% high for quota
  const smsHeight = 100;
  const whatsappHeight = 100;

  // Used height relative to its own quota
  const smsUsedHeight = smsPercentage;
  const whatsappUsedHeight = whatsappPercentage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl"
    >
      {/* Background animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-green-500/5"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white mb-8 text-center"
        >
          Usage Analytics
        </motion.h3>

        <div className="flex items-end justify-center space-x-12 h-64 mb-8">
          {/* SMS Bar */}
          {data.sms.total > 0 && (
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-48 bg-gray-700/30 rounded-2xl overflow-hidden">
                {/* Total quota background */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${smsHeight}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className="absolute bottom-0 w-full bg-blue-500/20 rounded-2xl"
                />

                {/* Used quota */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${smsUsedHeight}%` }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                  className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-2xl relative overflow-hidden"
                >
                  {/* Animated shine */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent"
                    animate={{ y: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>

                {/* Percentage label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-white text-xs font-bold transform rotate-90"
                  >
                    {smsPercentage.toFixed(0)}%
                  </motion.span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-4 text-center"
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-semibold">SMS</span>
                </div>
                <p className="text-white text-sm font-bold">
                  {data.sms.used.toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs">
                  of {data.sms.total.toLocaleString()}
                </p>
              </motion.div>
            </div>
          )}

          {/* WhatsApp Bar */}
          {data.whatsapp.total > 0 && (
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-48 bg-gray-700/30 rounded-2xl overflow-hidden">
                {/* Total quota background */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${whatsappHeight}%` }}
                  transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                  className="absolute bottom-0 w-full bg-green-500/20 rounded-2xl"
                />

                {/* Used quota */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${whatsappUsedHeight}%` }}
                  transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                  className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-2xl relative overflow-hidden"
                >
                  {/* Animated shine */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent"
                    animate={{ y: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  />
                </motion.div>

                {/* Percentage label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="text-white text-xs font-bold transform rotate-90"
                  >
                    {whatsappPercentage.toFixed(0)}%
                  </motion.span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-4 text-center"
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-semibold">WhatsApp</span>
                </div>
                <p className="text-white text-sm font-bold">
                  {data.whatsapp.used.toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs">
                  of {data.whatsapp.total.toLocaleString()}
                </p>
              </motion.div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded"></div>
            <span className="text-gray-400 text-sm">Used Quota</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-600/50 rounded"></div>
            <span className="text-gray-400 text-sm">Available Quota</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UsageChart;
