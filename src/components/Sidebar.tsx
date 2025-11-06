import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { logout } from "../store/slices/authSlice";
import { clearClientData } from "../store/slices/clientSlice";
import {
  HomeIcon,
  ChartBarIcon,
  PlusIcon,
  PaperAirplaneIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    localStorage.removeItem("auth_token");
    localStorage.removeItem("client_id");
    localStorage.removeItem("user_data");
    dispatch(logout());
    dispatch(clearClientData());
  };

  const toggleDropdown = (path: string) => {
    setOpenDropdown(openDropdown === path ? null : path);
  };

  const sidebarVariants = {
    expanded: {
      width: "280px",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    collapsed: {
      width: "80px",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white shadow-lg"
      >
        {isMobileOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border-r border-white/10 z-40 flex flex-col shadow-2xl
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          transition-transform duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center"
              >
                <span className="text-white font-bold text-xl">SN</span>
              </motion.div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.h1
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap overflow-hidden"
                  >
                    ShauryaNotify
                  </motion.h1>
                )}
              </AnimatePresence>
            </Link>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-5 h-5" />
              ) : (
                <ChevronLeftIcon className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 custom-scrollbar">
          <div className="space-y-2">
            {navigationItems.map(({ path, name, icon: Icon, subItems }) => {
              const isActive = location.pathname.startsWith(path);
              const isOpen = openDropdown === path;

              return (
                <div key={path}>
                  {subItems ? (
                    <div>
                      <motion.button
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleDropdown(path)}
                        className={`w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-200 group ${
                          isActive
                            ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <AnimatePresence mode="wait">
                            {!isCollapsed && (
                              <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="text-sm font-medium whitespace-nowrap overflow-hidden"
                              >
                                {name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                        {!isCollapsed && (
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDownIcon className="w-4 h-4" />
                          </motion.div>
                        )}
                      </motion.button>

                      <AnimatePresence>
                        {isOpen && !isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-8 mt-2 space-y-1"
                          >
                            {subItems.map((sub) => (
                              <Link
                                key={sub.path}
                                to={sub.path}
                                onClick={() => {
                                  setOpenDropdown(null);
                                  setIsMobileOpen(false);
                                }}
                              >
                                <motion.div
                                  whileHover={{ scale: 1.02, x: 4 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                    location.pathname === sub.path
                                      ? "bg-cyan-500/20 text-cyan-300"
                                      : "text-gray-400 hover:text-white hover:bg-white/5"
                                  }`}
                                >
                                  {sub.name}
                                </motion.div>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link to={path} onClick={() => setIsMobileOpen(false)}>
                      <motion.div
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-3 rounded-xl flex items-center space-x-3 transition-all duration-200 group ${
                          isActive
                            ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <AnimatePresence mode="wait">
                          {!isCollapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              className="text-sm font-medium whitespace-nowrap overflow-hidden"
                            >
                              {name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer - User & Logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {user && (
            <div
              className={`px-4 py-3 rounded-xl bg-white/5 border border-white/10 ${
                isCollapsed ? "flex justify-center" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <UserCircleIcon className="w-5 h-5 text-white" />
                </div>
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-gray-400">Logged in as</p>
                      <p className="text-sm text-white font-medium truncate max-w-[180px]">
                        {user.email}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className={`w-full px-4 py-3 rounded-xl flex items-center ${
              isCollapsed ? "justify-center" : "space-x-3"
            } text-gray-300 hover:text-white hover:bg-red-500/10 hover:border-red-500/30 border border-transparent transition-all duration-200`}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content Spacer */}
      <div
        className={`hidden lg:block transition-all duration-300 ${
          isCollapsed ? "lg:w-[80px]" : "lg:w-[280px]"
        }`}
      />
    </>
  );
};

export default Sidebar;
