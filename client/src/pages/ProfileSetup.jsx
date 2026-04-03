import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMapPin, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!name || !city) {
      toast.error("Fill all details");
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    // ✅ SAVE DATA
    localStorage.setItem("name", name);
    localStorage.setItem("city", city);

    toast.success("Profile saved ✅");
    setLoading(false);
    navigate("/platform");
  };

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

            <div className="relative">
              <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl px-4 py-4 border-2 border-transparent hover:border-blue-200 focus-within:border-blue-500 transition-all duration-300 shadow-sm">
                <FiUser className="text-gray-400 text-lg mr-3" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-transparent outline-none w-full text-base text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* CITY */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-3">City</label>

            <div className="relative">
              <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl px-4 py-4 border-2 border-transparent hover:border-blue-200 focus-within:border-blue-500 transition-all duration-300 shadow-sm">
                <FiMapPin className="text-gray-400 text-lg mr-3" />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Select your city"
                  className="bg-transparent outline-none w-full text-base text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleContinue}
            disabled={loading || !name || !city}
            className="w-full py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Continue to Verification
                <FiArrowRight className="text-lg" />
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}