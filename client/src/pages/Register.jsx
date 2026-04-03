import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPhone, FiUser, FiMapPin, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Step 1: Phone, Step 2: Name+City
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  // ✅ STEP 1: Verify Phone & Register
  const handlePhoneSubmit = async () => {
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      toast.error("Enter valid 10-digit number");
      return;
    }

    setLoading(true);

    try {
      // Check if user exists or register
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone,
          name: name || "User",
          city: city || "Unknown",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Save phone to localStorage
      localStorage.setItem("phone", phone);
      localStorage.setItem("userId", data.user._id);

      if (data.isNewUser) {
        toast.success("✅ Registered! Now complete your profile");
        setStep(2);
      } else {
        // User already exists - load their data
        localStorage.setItem("name", data.user.name || "");
        localStorage.setItem("city", data.user.city || "");
        if (data.user.plan) {
          localStorage.setItem("plan", JSON.stringify(data.user.plan));
        }
        if (data.user.orders) {
          localStorage.setItem("orders", JSON.stringify(data.user.orders));
        }
        
        toast.success(`👋 Welcome back, ${data.user.name}!`);
        setRegistered(true);
        
        // Redirect to dashboard after 1.5s
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Network error");
    }

    setLoading(false);
  };

  // ✅ STEP 2: Complete Profile
  const handleProfileSubmit = async () => {
    if (!name || !city) {
      toast.error("Fill all details");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/users/${phone}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, city }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Update failed");
        setLoading(false);
        return;
      }

      // Save to localStorage
      localStorage.setItem("name", name);
      localStorage.setItem("city", city);

      toast.success("✅ Profile completed!");
      setRegistered(true);

      // Redirect to platform verification
      setTimeout(() => navigate("/platform"), 1500);

    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Network error");
    }

    setLoading(false);
  };

  // ✅ STEP 1: Phone Input
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex flex-col">

        {/* HEADER */}
        <div className="h-56 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 rounded-b-3xl flex items-center justify-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-2xl" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-white text-3xl font-bold">Get Started</h1>
            <p className="text-white/80 text-sm mt-2">Join ShieldPay today</p>
          </div>
        </div>

        {/* CARD */}
        <div className="flex-1 px-5 py-8 flex flex-col justify-center">
          <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Enter Your Phone</h2>
              <p className="text-gray-500 text-sm mt-2">We'll check if you're already registered</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-3">Phone Number</label>

              <div className="relative">
                <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl px-4 py-4 border-2 border-transparent hover:border-blue-200 focus-within:border-blue-500 transition-all duration-300 shadow-sm">
                  <FiPhone className="text-gray-400 text-xl mr-3" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    onKeyPress={(e) => e.key === "Enter" && handlePhoneSubmit()}
                    placeholder="Enter 10-digit mobile"
                    maxLength="10"
                    disabled={loading}
                    className="bg-transparent outline-none w-full text-lg font-medium text-gray-900 placeholder-gray-400 disabled:opacity-50"
                  />
                </div>
                {phone.length > 0 && (
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500">
                    {phone.length}/10
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handlePhoneSubmit}
              disabled={loading || phone.length !== 10}
              className="w-full py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Continue
                  <FiArrowRight className="text-lg" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to our Terms & Privacy Policy
            </p>

          </div>
        </div>
      </div>
    );
  }

  // ✅ STEP 2: Name & City
  if (step === 2 && !registered) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">

        {/* HEADER */}
        <div className="h-56 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 rounded-b-3xl flex items-center justify-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-2xl" />
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-white text-3xl font-bold">Complete Your Profile</h1>
          </div>
        </div>

        {/* CARD */}
        <div className="flex-1 px-5 py-8 flex flex-col justify-center">
          <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">

            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold text-gray-900">Tell Us About You</h2>
              <p className="text-gray-500 text-sm mt-2">This helps us personalize your experience</p>
            </div>

            {/* NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-3">Full Name</label>

              <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl px-4 py-4 border-2 border-transparent hover:border-blue-200 focus-within:border-blue-500 transition-all duration-300 shadow-sm">
                <FiUser className="text-gray-400 text-lg mr-3" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={loading}
                  className="bg-transparent outline-none w-full text-base text-gray-900 placeholder-gray-400 disabled:opacity-50"
                />
              </div>
            </div>

            {/* CITY */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-3">City</label>

              <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl px-4 py-4 border-2 border-transparent hover:border-blue-200 focus-within:border-blue-500 transition-all duration-300 shadow-sm">
                <FiMapPin className="text-gray-400 text-lg mr-3" />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city"
                  disabled={loading}
                  className="bg-transparent outline-none w-full text-base text-gray-900 placeholder-gray-400 disabled:opacity-50"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleProfileSubmit}
              disabled={loading || !name || !city}
              className="w-full py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Complete Registration
                  <FiArrowRight className="text-lg" />
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    );
  }

  // ✅ Success State
  if (registered) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <FiCheckCircle className="text-green-600 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Set! 🎉</h1>
          <p className="text-gray-600 mb-6">Your account is ready to go</p>
          <div className="inline-block">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    );
  }
}
