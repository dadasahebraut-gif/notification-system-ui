import React from "react";
import { motion } from "framer-motion";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";

const ClientAllCampaigns: React.FC = () => {
  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl">
              <RocketLaunchIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                All Campaigns
              </h1>
              <p className="text-gray-400 mt-1">Manage client campaigns</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
        >
          <RocketLaunchIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Campaigns Found
          </h3>
          <p className="text-gray-400">Campaigns will appear here when created</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientAllCampaigns;
