import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { store } from "./store/store";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AnimatedBackground from "./components/AnimatedBackground";
import FloatingActionButton from "./components/FloatingActionButton";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import CreatePurpose from "./pages/CreatePurpose";
import CreateMembership from "./pages/CreateMembership";
import SendSMS from "./pages/SendSMS";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignVerification from "./pages/CampaignVerification";
import CampaignList from "./pages/CampaignList";
import CampaignReport from "./pages/CampaignReport";
import AuthProvider from "./components/AuthProvider";
import { PlusIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "./hooks/redux";
import CreateSender from "./pages/CreateSender";
import AllSenders from "./pages/AllSenders";

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AnimatedBackground />
      {isAuthenticated && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-project"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-purpose"
            element={
              <ProtectedRoute>
                <CreatePurpose />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-membership"
            element={
              <ProtectedRoute>
                <CreateMembership />
              </ProtectedRoute>
            }
          />
          <Route
            path="/send-sms"
            element={
              <ProtectedRoute>
                <SendSMS />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createcampaign"
            element={
              <ProtectedRoute>
                <CreateCampaign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-campaign"
            element={
              <ProtectedRoute>
                <CreateCampaign />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/upload-campaign" element={<ProtectedRoute><UploadCampaign /></ProtectedRoute>} />  */}
          <Route
            path="/campaign-list"
            element={
              <ProtectedRoute>
                <CampaignList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/verify-campaign/:campaignId"
            element={
              <ProtectedRoute>
                <CampaignVerification />
              </ProtectedRoute>
            }
          />

          <Route
            path="/campaign-list"
            element={
              <ProtectedRoute>
                <CampaignList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/campaign/:id/report"
            element={
              <ProtectedRoute>
                <CampaignReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-sender"
            element={
              <ProtectedRoute>
                <CreateSender />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-senders"
            element={
              <ProtectedRoute>
                <AllSenders />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>

      {/* Floating Action Buttons - only show when authenticated */}
      {isAuthenticated && (
        <>
          <FloatingActionButton
            to="/create-project"
            icon={<PlusIcon className="w-6 h-6" />}
            label="New Project"
            gradient="from-cyan-500 to-purple-500"
            position="bottom-right"
          />

          <FloatingActionButton
            to="/create-campaign"
            icon={<PlusIcon className="w-6 h-6" />}
            label="Campaign"
            gradient="from-green-400 to-blue-500"
            position="bottom-right"
          />

          <FloatingActionButton
            to="/send-sms"
            icon={<PaperAirplaneIcon className="w-6 h-6" />}
            label="Send SMS"
            gradient="from-orange-500 to-red-500"
            position="bottom-left"
          />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router basename="/notifications">
          <AppContent />
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
