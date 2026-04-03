import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Otp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const phone = localStorage.getItem("phone") || "XXXXXXXXXX";

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // ✅ handle input
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move forward
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // ✅ handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // clear current box
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  // ✅ handle paste (VERY IMPORTANT UX)
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    const newOtp = paste.split("");
    while (newOtp.length < 6) newOtp.push("");

    setOtp(newOtp);
  };

  // ✅ verify OTP
  const verifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter complete OTP");
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    if (finalOtp === "123456") {
      setVerified(true);
      toast.success("OTP verified ✅");
      setTimeout(() => navigate("/profile-setup"), 1500);
    } else {
      toast.error("Invalid OTP");
      setLoading(false);
    }
  };

  const resendOtp = () => {
    setResendCooldown(30);
    toast.success("OTP resent to your phone (use 123456)");
    setOtp(["", "", "", "", "", ""]);
    inputs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => navigate("/login")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <FiArrowLeft className="text-2xl text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Verify OTP</h1>
      </div>

      {/* CARD */}
      <div className="flex-1 px-5 py-8 flex flex-col justify-center">
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Enter Verification Code</h2>
            <p className="text-gray-500 text-sm mt-2">We sent a 6-digit code to {phone}</p>
          </div>

          {/* OTP BOXES */}
          <div
            className="flex gap-3 justify-center"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-14 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none bg-gradient-to-b from-gray-50 to-white transition-all duration-200 placeholder-gray-400"
                placeholder="•"
              />
            ))}
          </div>

          {/* VERIFY BUTTON */}
          <button
            onClick={verifyOtp}
            disabled={loading || otp.join("").length !== 6 || verified}
            className="w-full py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {verified ? (
              <>
                <FiCheckCircle className="text-lg" />
                Verified!
              </>
            ) : loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Verify OTP"
            )}
          </button>

          {/* RESEND */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">Didn't receive code?</p>
            <button
              onClick={resendOtp}
              disabled={resendCooldown > 0}
              className="text-blue-600 font-semibold text-sm mt-2 hover:text-blue-700 disabled:text-gray-400 transition-colors"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}