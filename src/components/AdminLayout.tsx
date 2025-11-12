import React, { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  UserIcon,
  TagIcon,
  PaperAirplaneIcon,
  RocketLaunchIcon,
  FolderIcon,
  ChevronDownIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useAppDispatch } from "../hooks/redux";
import { logout } from "../store/slices/authSlice";
import { clearClientData } from "../store/slices/clientSlice";

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("client_id");
    localStorage.removeItem("user_data");
    dispatch(logout());
    dispatch(clearClientData());
    navigate("/login");
  };

  const toggleDropdown = (path: string) => {
    setOpenDropdown(openDropdown === path ? null : path);
  };

  const navItems = [
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      icon: <ChartBarIcon className="w-5 h-5" />,
    },
    {
      path: "/admin/clients",
      name: "Clients",
      icon: <UsersIcon className="w-5 h-5" />,
    },
    {
      path: "/admin/subscriptions",
      name: "Subscriptions",
      icon: <DocumentTextIcon className="w-5 h-5" />,
    },
    {
      path: "/admin/plans",
      name: "Plans",
      icon: <SparklesIcon className="w-5 h-5" />,
    },
    {
      path: "/client-actions",
      name: "Client Actions",
      icon: <Squares2X2Icon className="w-5 h-5" />,
      subItems: [
        { path: "/dashboard", name: "Dashboard" },
        { path: "/create-sender", name: "Create Sender" },
        { path: "/all-senders", name: "All Senders" },
        { path: "/create-purpose", name: "Create Template" },
        { path: "/all-templates", name: "All Templates" },
        { path: "/send-sms", name: "Send SMS" },
        { path: "/create-campaign", name: "Create Campaign" },
        { path: "/campaign-list", name: "All Campaigns" },
        { path: "/create-project", name: "New Project" },
        { path: "/create-membership", name: "Add Plans" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Admin Portal
              </h1>
            </motion.div>

            <div className="flex items-center space-x-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const isOpen = openDropdown === item.path;

                if (item.subItems) {
                  return (
                    <div key={item.path} className="relative" ref={dropdownRef}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleDropdown(item.path)}
                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.icon}
                        <span className="text-sm font-medium">{item.name}</span>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </motion.button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                          >
                            {item.subItems.map((subItem) => (
                              <button
                                key={subItem.path}
                                onClick={() => {
                                  navigate(subItem.path);
                                  setOpenDropdown(null);
                                }}
                                className={`w-full px-4 py-3 text-left text-sm transition-all duration-200 ${
                                  location.pathname === subItem.path
                                    ? "bg-cyan-500/20 text-cyan-300"
                                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                                }`}
                              >
                                {subItem.name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <motion.button
                    key={item.path}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(item.path)}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.name}</span>
                  </motion.button>
                );
              })}

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
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
