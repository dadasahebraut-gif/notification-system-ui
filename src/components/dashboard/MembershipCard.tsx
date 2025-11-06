import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CurrencyRupeeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Membership } from "../../store/slices/clientSlice";

interface MembershipCardProps {
  membership: Membership;
  index: number;
}

const MembershipCard: React.FC<MembershipCardProps> = ({
  membership,
  index,
}) => {
  const quotaPercentage = (membership.QuotaUsed / membership.QuotaTotal) * 100;
  const validTill = new Date(membership.ValidTill);
  const daysRemaining = Math.ceil(
    (validTill.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
          let expiryStatus = "";

        if (
          membership.Status?.toLowerCase() === "active" &&
          (daysRemaining <= 7 || quotaPercentage >= 90)
        ) {
          if (daysRemaining <= 0 || quotaPercentage >= 100) {
            expiryStatus = "Expired";
          } else {
            expiryStatus = "Expiring Soon";
          }
        } else {
          expiryStatus = membership.Status
            ? membership.Status.charAt(0).toUpperCase() + membership.Status.slice(1).toLowerCase()
            : "Unknown";
        }



  const channelColor =
    membership.Plan?.Channel?.toLowerCase() === "sms"
      ? "from-blue-500 to-cyan-500"
      : "from-green-500 to-emerald-500";

  const channelIcon =
    membership.Plan?.Channel?.toLowerCase() === "sms" ? (
      <DevicePhoneMobileIcon className="w-6 h-6" />
    ) : (
      <ChatBubbleLeftRightIcon className="w-6 h-6" />
    );

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
      whileHover={{ y: -8, scale: 1.02 }}
      className={`bg-white/5 backdrop-blur-xl rounded-3xl p-8 border relative overflow-hidden group shadow-2xl ${
        expiryStatus !== "Active" ? "border-orange-500/50" : "border-white/10"
      }`}
    >
      {/* Animated background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${channelColor} opacity-10`}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Expiring Warning */}
      {/* {expiryStatus === "Expiring Soon" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 bg-orange-500/20 border border-orange-500/30 rounded-xl px-3 py-2 flex items-center space-x-2"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ExclamationTriangleIcon className="w-4 h-4 text-orange-400" />
          </motion.div>
          <span className="text-orange-400 text-xs font-semibold">
            Expiring Soon
          </span>
        </motion.div>
      )}  */}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            className={`p-4 rounded-2xl bg-gradient-to-r ${channelColor}`}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {channelIcon}
          </motion.div>

          <div className="text-right">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${
              expiryStatus.toLowerCase() === "active"
                ? "bg-green-500/20 text-green-300 border-green-500/30"
                : expiryStatus.toLowerCase() === "requested"
                ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                : expiryStatus.toLowerCase() === "rejected"
                ? "bg-red-500/20 text-red-300 border-red-500/30"
                : expiryStatus.toLowerCase() === "expired"
                ? "bg-gray-500/20 text-gray-300 border-gray-500/30"
                : "bg-orange-500/20 text-orange-300 border-orange-500/30"
            }`}


            >
              {expiryStatus}
            </motion.span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-cyan-300 transition-colors">
          {membership.Plan?.Name || `${membership.Plan?.Channel} Plan`}
        </h3>

        {/* Plan Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/20 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <CurrencyRupeeIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400 text-sm">Price</span>
            </div>
            <p className="text-xl font-bold text-white">
              ₹{membership.Plan?.Price?.toLocaleString()}
            </p>
          </div>

          <div className="bg-black/20 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <ClockIcon className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-sm">Duration</span>
            </div>
            <p className="text-xl font-bold text-white">
              {membership.Plan?.Duration} days
            </p>
          </div>
        </div>

        {/* Quota Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Quota Usage</span>
            <span className="text-sm text-white font-semibold">
              {membership.QuotaUsed.toLocaleString()} /{" "}
              {membership.QuotaTotal.toLocaleString()}
            </span>
          </div>

          <div className="w-full bg-gray-700/50 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${quotaPercentage}%` }}
              transition={{
                duration: 1.5,
                delay: 0.3 + index * 0.1,
                ease: "easeOut",
              }}
              className={`h-4 rounded-full relative overflow-hidden ${
                quotaPercentage >= 90
                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                  : quotaPercentage >= 70
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                  : `bg-gradient-to-r ${channelColor}`
              }`}
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {quotaPercentage.toFixed(1)}% used
            </span>
            <span className="text-xs text-gray-400">
              {(membership.QuotaTotal - membership.QuotaUsed).toLocaleString()}{" "}
              remaining
            </span>
          </div>
        </div>

        {/* Validity */}
        {!["requested", "rejected"].includes(expiryStatus.toLowerCase()) && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Valid Till</span>
            </div>
            <span
              className={`text-sm font-semibold ${
                daysRemaining <= 7 ? "text-orange-400" : "text-white"
              }`}
            >
              {validTill.toLocaleDateString()} ({daysRemaining} days)
            </span>
          </div>
        )}

        {/* Action Button */}
        {(expiryStatus === "Expired" || expiryStatus === "Expiring Soon") && (
          <Link to="/create-membership">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Renew Plan</span>
            </motion.button>
          </Link>
        )}

      </div>
    </motion.div>
  );
};

export default MembershipCard;
