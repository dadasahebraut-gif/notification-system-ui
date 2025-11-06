import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
  icon: React.ReactNode;
  gradient: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionLink,
  icon,
  gradient,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`inline-flex items-center justify-center w-40 h-40 bg-gradient-to-r ${gradient} rounded-full mb-8 relative overflow-hidden`}
      >
        <div className="text-white text-6xl">{icon}</div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
            }}
            animate={{
              x: Math.cos((i * 60 * Math.PI) / 180) * 50,
              y: Math.sin((i * 60 * Math.PI) / 180) * 50,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-white mb-6"
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 mb-10 max-w-lg mx-auto text-lg"
      >
        {description}
      </motion.p>

      <Link to={actionLink}>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`px-10 py-5 bg-gradient-to-r ${gradient} text-white font-semibold rounded-2xl hover:shadow-2xl transition-all duration-200 flex items-center space-x-3 mx-auto text-lg`}
        >
          {icon}
          <span>{actionText}</span>
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default EmptyState;
