import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PlusIcon,
  TagIcon,
  PaperAirplaneIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const QuickActions: React.FC = () => {
  const actions = [
    {
      to: "/create-project",
      icon: <PlusIcon className="w-6 h-6" />,
      label: "New Project",
      gradient: "from-cyan-500 to-purple-500",
      description: "Create a new notification project",
    },
    {
      to: "/create-purpose",
      icon: <TagIcon className="w-6 h-6" />,
      label: "New Template",
      gradient: "from-purple-500 to-pink-500",
      description: "Define notification templates",
    },
    {
      to: "/send-sms",
      icon: <PaperAirplaneIcon className="w-6 h-6" />,
      label: "Send Message",
      gradient: "from-orange-500 to-red-500",
      description: "Send instant notifications",
    },
    {
      to: "/create-membership",
      icon: <SparklesIcon className="w-6 h-6" />,
      label: "Add Plans",
      gradient: "from-emerald-500 to-teal-500",
      description: "Upgrade your capabilities",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-12"
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="text-3xl font-bold text-white mb-8 text-center"
      >
        Quick Actions
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {actions.map((action, index) => (
          <Link key={action.to} to={action.to}>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.6 + index * 0.1,
                type: "spring",
                stiffness: 300,
              }}
              whileHover={{
                y: -8,
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-br ${action.gradient} backdrop-blur-xl rounded-3xl p-8 border border-white/20 relative overflow-hidden group shadow-xl cursor-pointer`}
            >
              {/* Hover effect */}
              <motion.div
                className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              <div className="relative z-10 text-center">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm"
                >
                  {action.icon}
                </motion.div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white/90 transition-colors">
                  {action.label}
                </h3>

                <p className="text-white/70 text-sm leading-relaxed">
                  {action.description}
                </p>

                {/* Arrow indicator */}
                <motion.div
                  className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-white text-sm">→</span>
                </motion.div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;
