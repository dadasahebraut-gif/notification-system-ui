import React from "react";
import { motion } from "framer-motion";
import { FolderIcon } from "@heroicons/react/24/outline";

const ClientCreateProject: React.FC = () => {
  return (
    <div className="min-h-screen p-6 lg:p-12">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl">
              <FolderIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Create Project
              </h1>
              <p className="text-gray-400 mt-1">Create a new project for client</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl border border-white/10 bg-white/5 rounded-2xl p-8 shadow-2xl text-center"
        >
          <p className="text-gray-400 text-lg">Project creation interface coming soon</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientCreateProject;
