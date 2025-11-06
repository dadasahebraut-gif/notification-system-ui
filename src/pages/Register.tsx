import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
// import { useAppDispatch } from "../hooks/redux";
import { getApiUrl } from "../config/api";
import { 
  SparklesIcon, 
  RocketLaunchIcon, 
  CheckCircleIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  StarIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";

interface Plan {
  ID: string;
  Name: string;
  Description: string;
  Channel: string;
  Quota: number;
  Price: number;
  Duration: number;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

interface MembershipType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface ValidationError {
  field: string;
  rule: string;
  message: string;
}

const membershipTypes: MembershipType[] = [
  {
    id: 'sms',
    name: 'SMS',
    icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    description: 'Send SMS notifications'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    description: 'Send WhatsApp messages'
  }
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Membership Selection, 3: Plan Selection
  const [formData, setFormData] = useState({
    clientName: "",
    clientDescription: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
  });
  
  const [selectedMemberships, setSelectedMemberships] = useState<string[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");
  // const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch plans when membership types are selected
  useEffect(() => {
    if (selectedMemberships.length > 0) {
      fetchPlans();
    }
  }, [selectedMemberships]);

  const fetchPlans = async () => {
    setPlansLoading(true);
    try {
      const response = await fetch(getApiUrl("/plans"));
      const data = await response.json();
      
      if (data.plans) {
        // Filter plans based on selected membership types
        const filteredPlans = data.plans.filter((plan: Plan) => 
          selectedMemberships.includes(plan.Channel.toLowerCase())
        );
        setPlans(filteredPlans);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError("Failed to fetch plans. Please try again.");
    }
    setPlansLoading(false);
  };

  const validateStep1 = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.clientName.trim()) {
      errors.clientName = "Client name is required";
    }
    
    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\s/g, ''))) {
      errors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }
    
    if (!formData.clientDescription.trim()) {
      errors.clientDescription = "Client description is required";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    if (selectedMemberships.length === 0) {
      setError("Please select at least one membership type");
      return false;
    }
    setError("");
    return true;
  };

  // const validateStep3 = () => {
  //   if (selectedPlans.length === 0) {
  //     setError("Please select at least one plan");
  //     return false;
  //   }
  //   setError("");
  //   return true;
  // };

  const handleMembershipToggle = (membershipId: string) => {
    setSelectedMemberships(prev => {
      const newSelection = prev.includes(membershipId)
        ? prev.filter(id => id !== membershipId)
        : [...prev, membershipId];
      
      // Clear selected plans when membership changes
      setSelectedPlans([]);
      return newSelection;
    });
    setError(""); // Clear error when user makes selection
  };

  const handlePlanToggle = (planId: string) => {
    setSelectedPlans(prev => 
      prev.includes(planId)
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
    setError(""); // Clear error when user makes selection
  };

  const formatServerError = (errorMessage: string) => {
    if (errorMessage.includes("duplicate key value violates unique constraint")) {
      if (errorMessage.includes("idx_users_mobile")) {
        return "This mobile number is already registered. Please use a different number or try logging in.";
      }
      if (errorMessage.includes("idx_users_email")) {
        return "This email address is already registered. Please use a different email or try logging in.";
      }
      return "This information is already registered. Please check your details.";
    }
    return errorMessage;
  };

  const handleValidationErrors = (errors: ValidationError[]) => {
    const fieldErrorMap: {[key: string]: string} = {};
    
    errors.forEach(error => {
      const fieldName = error.field.toLowerCase();
      let friendlyMessage = "";
      
      switch (fieldName) {
        case 'email':
          friendlyMessage = "Email address is required";
          break;
        case 'password':
          friendlyMessage = "Password is required";
          break;
        case 'name':
          friendlyMessage = "Client name is required";
          break;
        case 'mobile':
          friendlyMessage = "Mobile number is required";
          break;
        case 'description':
          friendlyMessage = "Client description is required";
          break;
        default:
          friendlyMessage = error.message;
      }
      
      fieldErrorMap[fieldName] = friendlyMessage;
    });
    
    setFieldErrors(fieldErrorMap);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    // setValidationErrors([]);
    setFieldErrors({});

    try {
      // Step 1: Register client
      const clientResponse = await fetch(getApiUrl("/clients"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.clientName,
          description: formData.clientDescription,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobileNumber,
        }),
      });

      const clientData = await clientResponse.json();

      if (clientData.status === "validation_error" && clientData.error) {
        handleValidationErrors(clientData.error);
        setLoading(false);
        return;
      }

      if (clientData.status !== "success") {
        throw new Error(formatServerError(clientData.error || clientData.message || "Client registration failed"));
      }

      const clientId = clientData.data.client_id;

      // Step 2: Create memberships
      const membershipPayload = selectedPlans.map(planId => ({
        client_id: clientId,
        plan_id: planId
      }));

      const membershipResponse = await fetch(getApiUrl("/membership"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(membershipPayload),
      });

      const membershipData = await membershipResponse.json();

      if (membershipData.status !== "success") {
        throw new Error(formatServerError(membershipData.error || membershipData.message || "Membership creation failed"));
      }

      // Step 3: Auto-login
      // Step 3: Registration complete — redirect user to login page
      setRegistrationSuccess(true);

      // Wait for success animation/message, then redirect
      navigate('/login');



    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(""); // Clear errors when going back
    }
  };

  const smsPlans = plans.filter(plan => plan.Channel.toLowerCase() === 'sms');
  const whatsappPlans = plans.filter(plan => plan.Channel.toLowerCase() === 'whatsapp');

 

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-6"
          >
            <SparklesIcon className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Join ShauryaNotify
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Create your account and choose your notification plans
          </p>
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  step >= stepNum
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {step > stepNum ? <CheckCircleIcon className="w-6 h-6" /> : stepNum}
              </div>
              {stepNum < 3 && (
                <div
                  className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    step > stepNum ? "bg-gradient-to-r from-cyan-500 to-purple-500" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start space-x-3"
            >
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (fieldErrors.email) {
                            setFieldErrors(prev => ({ ...prev, email: "" }));
                          }
                        }}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                          fieldErrors.email 
                            ? "border-red-500 focus:ring-red-500/50 focus:border-red-500" 
                            : "border-white/10 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                        }`}
                        placeholder="your@email.com"
                      />
                      {fieldErrors.email && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.mobileNumber}
                        onChange={(e) => {
                          setFormData({ ...formData, mobileNumber: e.target.value });
                          if (fieldErrors.mobileNumber || fieldErrors.mobile) {
                            setFieldErrors(prev => ({ ...prev, mobileNumber: "", mobile: "" }));
                          }
                        }}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                          (fieldErrors.mobileNumber || fieldErrors.mobile)
                            ? "border-red-500 focus:ring-red-500/50 focus:border-red-500" 
                            : "border-white/10 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                        }`}
                        placeholder="Your mobile number"
                      />
                      {(fieldErrors.mobileNumber || fieldErrors.mobile) && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {fieldErrors.mobileNumber || fieldErrors.mobile}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => {
                        setFormData({ ...formData, clientName: e.target.value });
                        if (fieldErrors.clientName || fieldErrors.name) {
                          setFieldErrors(prev => ({ ...prev, clientName: "", name: "" }));
                        }
                      }}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        (fieldErrors.clientName || fieldErrors.name)
                          ? "border-red-500 focus:ring-red-500/50 focus:border-red-500" 
                          : "border-white/10 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                      }`}
                      placeholder="Enter your company name"
                    />
                    {(fieldErrors.clientName || fieldErrors.name) && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {fieldErrors.clientName || fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Client Description *
                    </label>
                    <textarea
                      value={formData.clientDescription}
                      onChange={(e) => {
                        setFormData({ ...formData, clientDescription: e.target.value });
                        if (fieldErrors.clientDescription || fieldErrors.description) {
                          setFieldErrors(prev => ({ ...prev, clientDescription: "", description: "" }));
                        }
                      }}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 h-24 resize-none ${
                        (fieldErrors.clientDescription || fieldErrors.description)
                          ? "border-red-500 focus:ring-red-500/50 focus:border-red-500" 
                          : "border-white/10 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                      }`}
                      placeholder="Describe your business or project"
                    />
                    {(fieldErrors.clientDescription || fieldErrors.description) && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        {fieldErrors.clientDescription || fieldErrors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value });
                            if (fieldErrors.password) {
                              setFieldErrors(prev => ({ ...prev, password: "" }));
                            }
                          }}
                          className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                            fieldErrors.password
                              ? "border-red-500 focus:ring-red-500/50 focus:border-red-500" 
                              : "border-white/10 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                          }`}
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {fieldErrors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => {
                            setFormData({ ...formData, confirmPassword: e.target.value });
                            if (fieldErrors.confirmPassword) {
                              setFieldErrors(prev => ({ ...prev, confirmPassword: "" }));
                            }
                          }}
                          className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                            fieldErrors.confirmPassword
                              ? "border-red-500 focus:ring-red-500/50 focus:border-red-500" 
                              : "border-white/10 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                          }`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="w-5 h-5" />
                          ) : (
                            <EyeIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {fieldErrors.confirmPassword && (
                        <p className="text-red-400 text-sm mt-1 flex items-center">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {fieldErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Choose Membership Types</h2>
                <p className="text-gray-400 mb-6">Select the notification channels you want to use (you can select both)</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {membershipTypes.map((membership) => (
                    <motion.div
                      key={membership.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMembershipToggle(membership.id)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedMemberships.includes(membership.id)
                          ? `border-transparent bg-gradient-to-r ${membership.color} bg-opacity-20`
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${membership.color}`}>
                          {membership.icon}
                        </div>
                        {selectedMemberships.includes(membership.id) && (
                          <CheckCircleIcon className="w-6 h-6 text-green-400" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{membership.name}</h3>
                      <p className="text-gray-400">{membership.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Select Your Plans</h2>
                <p className="text-gray-400 mb-6">Choose the plans that best fit your needs</p>
                
                {plansLoading ? (
                  <div className="text-center py-8">
                    <motion.div
                      className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-gray-400 mt-4">Loading plans...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {selectedMemberships.includes('sms') && smsPlans.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-blue-400 mb-6 flex items-center">
                          <DevicePhoneMobileIcon className="w-6 h-6 mr-2" />
                          SMS Plans
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {smsPlans.map((plan) => (
                            <motion.div
                              key={plan.ID}
                              whileHover={{ scale: 1.03, y: -5 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handlePlanToggle(plan.ID)}
                              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                selectedPlans.includes(plan.ID)
                                  ? "border-blue-500 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 shadow-lg shadow-blue-500/25"
                                  : "border-white/10 bg-gradient-to-br from-white/5 to-white/2 hover:border-blue-300/30 hover:shadow-lg"
                              }`}
                            >
                              {/* Background Pattern */}
                              <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full -translate-y-16 translate-x-16"></div>
                              </div>
                              
                              <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                                    <DevicePhoneMobileIcon className="w-6 h-6 text-white" />
                                  </div>
                                  {selectedPlans.includes(plan.ID) && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="p-1 rounded-full bg-green-500"
                                    >
                                      <CheckCircleIcon className="w-5 h-5 text-white" />
                                    </motion.div>
                                  )}
                                </div>
                                
                                <h4 className="text-xl font-bold text-white mb-2">{plan.Name}</h4>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{plan.Description}</p>
                                
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center text-lg font-bold">
                                      <CurrencyRupeeIcon className="w-5 h-5 text-green-400 mr-1" />
                                      <span className="text-white">₹{plan.Price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      <ClockIcon className="w-4 h-4 text-yellow-400 mr-1" />
                                      <span className="text-gray-300">{plan.Duration} days</span>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-black/20 rounded-lg p-3">
                                    <div className="flex items-center justify-center">
                                      <DevicePhoneMobileIcon className="w-4 h-4 text-blue-400 mr-2" />
                                      <span className="text-white font-semibold">{plan.Quota.toLocaleString()} SMS</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-center pt-2">
                                    <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                                    <span className="text-xs text-gray-400">Popular Choice</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMemberships.includes('whatsapp') && whatsappPlans.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-green-400 mb-6 flex items-center">
                          <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2" />
                          WhatsApp Plans
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {whatsappPlans.map((plan) => (
                            <motion.div
                              key={plan.ID}
                              whileHover={{ scale: 1.03, y: -5 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handlePlanToggle(plan.ID)}
                              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                                selectedPlans.includes(plan.ID)
                                  ? "border-green-500 bg-gradient-to-br from-green-500/20 to-emerald-500/10 shadow-lg shadow-green-500/25"
                                  : "border-white/10 bg-gradient-to-br from-white/5 to-white/2 hover:border-green-300/30 hover:shadow-lg"
                              }`}
                            >
                              {/* Background Pattern */}
                              <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full -translate-y-16 translate-x-16"></div>
                              </div>
                              
                              <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                                  </div>
                                  {selectedPlans.includes(plan.ID) && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="p-1 rounded-full bg-green-500"
                                    >
                                      <CheckCircleIcon className="w-5 h-5 text-white" />
                                    </motion.div>
                                  )}
                                </div>
                                
                                <h4 className="text-xl font-bold text-white mb-2">{plan.Name}</h4>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{plan.Description}</p>
                                
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center text-lg font-bold">
                                      <CurrencyRupeeIcon className="w-5 h-5 text-green-400 mr-1" />
                                      <span className="text-white">₹{plan.Price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                      <ClockIcon className="w-4 h-4 text-yellow-400 mr-1" />
                                      <span className="text-gray-300">{plan.Duration} days</span>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-black/20 rounded-lg p-3">
                                    <div className="flex items-center justify-center">
                                      <ChatBubbleLeftRightIcon className="w-4 h-4 text-green-400 mr-2" />
                                      <span className="text-white font-semibold">{plan.Quota.toLocaleString()} messages</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-center pt-2">
                                    <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                                    <span className="text-xs text-gray-400">Premium Choice</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {step < 3 ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <motion.div
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <RocketLaunchIcon className="w-5 h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;