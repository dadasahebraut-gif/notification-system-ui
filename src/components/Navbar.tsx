import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { logout } from "../store/slices/authSlice";
import { clearClientData } from "../store/slices/clientSlice";
import {
  HomeIcon,
  ChartBarIcon,
  PlusIcon,
  PaperAirplaneIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
 
const Navbar: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (navRef.current && !navRef.current.contains(e.target as Node)) {
      setOpenDropdown(null);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

 
  const navigationItems = [
  { path: "/dashboard", name: "Dashboard", icon: ChartBarIcon },
  {
    path: "/create-campaign",
    name: "Campaign",
    icon: PlusIcon,
    subItems: [
      { path: "/create-campaign", name: "Create Campaign" },
      { path: "/campaign-list", name: "All Campaigns" },
    ],
  },
  { path: "/create-project", name: "New Project", icon: PlusIcon },
  { path: "/create-membership", name: "Add Plans", icon: HomeIcon },
  { path: "/send-sms", name: "Send SMS", icon: PaperAirplaneIcon },
  {
    path: "/create-sender",
    name: "Sender",
    icon: PlusIcon,
    subItems: [
      { path: "/create-sender", name: "Create Sender" },
      { path: "/all-senders", name: "All Senders" },
    ],
  },
];
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("client_id");
    localStorage.removeItem("user_data");
 
    // Clear Redux state
    dispatch(logout());
    dispatch(clearClientData());
  };
 
  const toggleDropdown = (path: string) => {
    setOpenDropdown(openDropdown === path ? null : path);
  };
 
  return (
    <nav ref={navRef} className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Link to="/dashboard">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ShauryaNotify
              </h1>
            </Link>
          </motion.div>
 
          <div className="flex items-center space-x-4 relative">
            {navigationItems.map(({ path, name, icon: Icon, subItems }) => {
              const isActive = location.pathname.startsWith(path);
              const isOpen = openDropdown === path;
 
              return (
                <div key={path} className="relative">
                  {subItems ? (
                    <div
                      onClick={() => toggleDropdown(path)}
                      className={`cursor-pointer px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                  ) : (
                    <Link to={path}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{name}</span>
                      </motion.div>
                    </Link>
                  )}
 
                  {/* Dropdown menu */}
                  {subItems && isOpen && (
                    <div className="absolute left-0 mt-2 bg-white/10 rounded-md shadow-lg z-50">
                      {subItems.map((sub) => (
                      <Link
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setOpenDropdown(null)} // 👈 closes dropdown
                    >
                      <div className="px-4 py-2 text-gray-300 hover:bg-cyan-500/20 hover:text-white whitespace-nowrap">
                        {sub.name}
                      </div>
                    </Link>
                  ))}

                    </div>
                  )}
                </div>
              );
            })}
 
            {/* User + Logout */}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-white/10">
              {user && <span className="text-sm text-gray-300">{user.email}</span>}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-red-500/10 hover:border-red-500/30 border border-transparent transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
 
export default Navbar;