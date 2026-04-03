import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/hero.png";
import { FiPhone, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      toast.error("Enter valid 10-digit number");
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    localStorage.setItem("phone", phone);
    toast.success("OTP sent (use 123456)");
    setLoading(false);
    navigate("/otp");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendOtp();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex flex-col">

      {/* HEADER */}
      <div className="h-56 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 rounded-b-3xl flex items-center justify-center shadow-lg relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-2xl" />
        </div>
        <img src={logo} className="w-44 bg-white/10 backdrop-blur-sm p-4 rounded-2xl shadow-xl" alt="ShieldPay" />
      </div>

      {/* CARD */}
      <div className="flex-1 px-5 py-6 flex flex-col justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
            <p className="text-gray-500 text-base mt-2">Enter your phone number to continue</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-3">Phone Number</label>

            <div className="relative">
              <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl px-4 py-4 border-2 border-transparent hover:border-blue-200 focus-within:border-blue-500 transition-all duration-300 shadow-sm">
                <FiPhone className="text-gray-400 text-xl mr-3" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter 10-digit mobile"
                  maxLength="10"
                  className="bg-transparent outline-none w-full text-lg font-medium text-gray-900 placeholder-gray-400"
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
            onClick={sendOtp}
            disabled={loading || phone.length !== 10}
            className="w-full py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Send OTP
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