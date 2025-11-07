import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import {
  setClientData,
  setLoading,
  setError,
  setMemberships,
  setMembershipLoading,
} from "../store/slices/clientSlice";
import { getApiUrl } from "../config/api";
import LoadingSpinner from "../components/LoadingSpinner";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCard from "../components/dashboard/StatsCard";
import ClientInfoCard from "../components/dashboard/ClientInfoCard";
import MembershipCard from "../components/dashboard/MembershipCard";
import ProjectCard from "../components/dashboard/ProjectCard";
import QuickActions from "../components/dashboard/QuickActions";
import EmptyState from "../components/dashboard/EmptyState";
import UsageChart from "../components/dashboard/UsageChart";
import QuotaChart from "../components/dashboard/QuotaChart";
import {
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  FolderIcon,
  ChartBarIcon,
  SparklesIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, token, clientId } = useAppSelector((state) => state.auth);
  const { clientData, loading, error, memberships, membershipLoading } =
    useAppSelector((state) => state.client);

  // Fetch client data
  useEffect(() => {
    const fetchClientData = async () => {
      if (!clientId || !token) return;

      dispatch(setLoading(true));
      try {
        const response = await fetch(getApiUrl(`/clients/${clientId}`), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.status === "success") {
          const client = data.data;
          dispatch(setClientData(client));

          // 🔹 Extract project API keys
          if (client.Projects && client.Projects.length > 0) {
            const apiKeys: Record<string, string> = {};

            client.Projects.forEach((project: any) => {
              if (project?.APIKey?.Key) {
                const idKey = String(project.ID);
                apiKeys[idKey] = String(project.APIKey.Key);
              }
            });

            // 🔹 Save all API keys to localStorage
            localStorage.setItem("api_keys", JSON.stringify(apiKeys));
          }
        } else {
          dispatch(setError(data.message || "Failed to fetch client data"));
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        dispatch(setError("Failed to fetch client data"));
      }
    };

    fetchClientData();
  }, [clientId, token, dispatch]);

  // Fetch memberships
  useEffect(() => {
    const fetchMemberships = async () => {
      if (!clientId || !token) return;

      dispatch(setMembershipLoading(true));
      try {
        const response = await fetch(getApiUrl(`/membership/${clientId}`), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.status === "success") {
          dispatch(setMemberships(data.data || []));
        } else {
          console.error("Failed to fetch memberships:", data.message);
          dispatch(setMemberships([]));
        }
      } catch (error) {
        console.error("Error fetching memberships:", error);
        dispatch(setMemberships([]));
      }
    };

    fetchMemberships();
  }, [clientId, token, dispatch]);

  // ACTIVE SMS PLANS ONLY
  const activeSMSMemberships = memberships.filter(
    (m) =>
      m.Plan?.Channel?.toLowerCase() === "sms" &&
      m.Status?.toLowerCase() === "active"
  );

  const totalSMSQuota = activeSMSMemberships.reduce(
    (sum, m) => sum + m.QuotaTotal,
    0
  );

  const usedSMSQuota = activeSMSMemberships.reduce(
    (sum, m) => sum + m.QuotaUsed,
    0
  );

  const remainingSMS = totalSMSQuota - usedSMSQuota;

  // ACTIVE WHATSAPP PLANS ONLY
  const activeWhatsAppMemberships = memberships.filter(
    (m) =>
      m.Plan?.Channel?.toLowerCase() === "whatsapp" &&
      m.Status?.toLowerCase() === "active"
  );

  const totalWhatsAppQuota = activeWhatsAppMemberships.reduce(
    (sum, m) => sum + m.QuotaTotal,
    0
  );

  const usedWhatsAppQuota = activeWhatsAppMemberships.reduce(
    (sum, m) => sum + m.QuotaUsed,
    0
  );

  const remainingWhatsApp = totalWhatsAppQuota - usedWhatsAppQuota;

  // Total Projects & Active Plans Count (unchanged)
  const totalProjects = clientData?.Projects?.length || 0;
  const activePlans = memberships.filter(
    (m) => m.Status?.toLowerCase() === "active"
  ).length;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 mt-6 text-lg"
          >
            Loading your dashboard...
          </motion.p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-400 text-3xl">⚠</span>
          </div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-400 mb-8 text-lg">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-cyan-600 hover:to-purple-600 transition-colors shadow-lg"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // No client data
  if (!clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome {user?.email}
          </h2>
          <p className="text-gray-400 mb-8 text-lg">No client data available</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 lg:px-20 py-8 lg:ml-[280px]">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <DashboardHeader clientName={clientData.Name} />

        {/* No Memberships State */}
        {memberships.length === 0 && !membershipLoading && (
          <EmptyState
            title="🚀 Ready to Get Started?"
            description="You don't have any active memberships yet. Choose your notification plans to start sending SMS and WhatsApp messages!"
            actionText="Choose Your Plans"
            actionLink="/create-membership"
            icon={<SparklesIcon className="w-20 h-20" />}
            gradient="from-orange-500 to-red-500"
          />
        )}

        {/* Main Dashboard Content */}
        {memberships.length > 0 && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
              {/* SMS Stats */}
              {activeSMSMemberships.length > 0 && (
                <StatsCard
                  title="SMS Remaining"
                  value={remainingSMS}
                  subtitle={`${usedSMSQuota.toLocaleString()} / ${totalSMSQuota.toLocaleString()} used`}
                  icon={
                    <DevicePhoneMobileIcon className="w-8 h-8 text-white" />
                  }
                  gradient="from-blue-500/20 to-cyan-600/20"
                  progress={
                    totalSMSQuota > 0
                      ? ((totalSMSQuota - (totalSMSQuota - usedSMSQuota)) /
                          totalSMSQuota) *
                        100
                      : 0
                  }
                  delay={0.1}
                />
              )}

              {/* WhatsApp Stats */}
              {activeWhatsAppMemberships.length > 0 && (
                <StatsCard
                  title="WhatsApp Remaining"
                  value={remainingWhatsApp}
                  subtitle={`${usedWhatsAppQuota.toLocaleString()} / ${totalWhatsAppQuota.toLocaleString()} used`}
                  icon={
                    <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
                  }
                  gradient="from-green-500/20 to-emerald-600/20"
                  progress={
                    totalWhatsAppQuota > 0
                      ? ((totalWhatsAppQuota -
                          (totalWhatsAppQuota - usedWhatsAppQuota)) /
                          totalWhatsAppQuota) *
                        100
                      : 0
                  }
                  delay={0.2}
                />
              )}

              {/* Total Projects */}
              <StatsCard
                title="Total Projects"
                value={totalProjects}
                icon={<FolderIcon className="w-8 h-8 text-white" />}
                gradient="from-purple-500/20 to-pink-600/20"
                delay={0.3}
              />

              {/* Active Plans */}
              <StatsCard
                title="Active Plans"
                value={activePlans}
                icon={<ChartBarIcon className="w-8 h-8 text-white" />}
                gradient="from-cyan-500/20 to-blue-600/20"
                delay={0.4}
              />
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-16">
              {/* Usage Chart */}
              <div className="xl:col-span-2">
                <UsageChart
                  data={{
                    sms: { used: usedSMSQuota, total: totalSMSQuota },
                    whatsapp: {
                      used: usedWhatsAppQuota,
                      total: totalWhatsAppQuota,
                    },
                  }}
                />
              </div>
              <div className="xl:col-span-1">
                <ClientInfoCard client={clientData} userEmail={user?.email} />
              </div>
            </div>

            {/* Client Information */}
            {/* <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-16">
              <div className="xl:col-span-1 ">
                <ClientInfoCard client={clientData} userEmail={user?.email} />
              </div> */}
            {/* Quota Charts */}
            {/* <div className="xl:col-span-1">
                {smsMemeberships.length > 0 && (
                  <QuotaChart
                    used={usedSMSQuota}
                    total={totalSMSQuota}
                    label="SMS Quota"
                    color="from-blue-500/20 to-cyan-600/20"
                    icon={
                      <DevicePhoneMobileIcon className="w-6 h-6 text-white" />
                    }
                  />
                )}
              </div>
              <div className="xl:col-span-1">
                {whatsappMemberships.length > 0 && (
                  <QuotaChart
                    used={usedWhatsAppQuota}
                    total={totalWhatsAppQuota}
                    label="WhatsApp Quota"
                    color="from-green-500/20 to-emerald-600/20"
                    icon={
                      <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                    }
                  />
                )}
              </div> */}
            {/* </div> */}

            {/* Membership Summary */}
            {/*    <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Membership Summary
                </h3>

                <div className="space-y-4">
                  <div className="bg-black/20 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Total Plans</p>
                    <p className="text-3xl font-bold text-white">
                      {memberships.length}
                    </p>
                  </div>

                  <div className="bg-black/20 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Active Plans</p>
                    <p className="text-3xl font-bold text-green-400">
                      {activePlans}
                    </p>
                  </div>

                  <div className="bg-black/20 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Total Quota</p>
                    <p className="text-2xl font-bold text-cyan-400">
                      {(totalSMSQuota + totalWhatsAppQuota).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div> */}

            {/* Quick Actions */}
            {/* <QuickActions /> */}

            {/* Memberships */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-16"
            >
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-4xl font-bold text-white mb-12 text-center"
              >
                Your Active Memberships
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {memberships.map((membership, index) => (
                  <MembershipCard
                    key={membership.ID}
                    membership={membership}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Projects Section */}
        {totalProjects === 0 ? (
          <EmptyState
            title="🚀 Launch Your First Project!"
            description="You're all set with your memberships! Now create your first project to start sending notifications."
            actionText="Create Your First Project"
            actionLink="/create-project"
            icon={<RocketLaunchIcon className="w-20 h-20" />}
            gradient="from-cyan-500 to-purple-500"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="text-4xl font-bold text-white mb-12 text-center"
            >
              Your Projects
            </motion.h2>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {clientData.Projects?.map((project, index) => (
                <ProjectCard key={project.ID} project={project} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
