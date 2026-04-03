import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiArrowRight } from "react-icons/fi";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { MdOutlineLocationOn } from "react-icons/md";
import { AiOutlineWarning } from "react-icons/ai";
import toast from "react-hot-toast";

export default function Location() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        console.log("LOCATION:", coords);

        localStorage.setItem("location", JSON.stringify(coords));

        toast.success("Location captured ✅");
        setTimeout(() => navigate("/income"), 1000);
      },
      () => {
        toast.error("Location permission denied");
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">

      {/* HEADER */}
      <div className="h-56 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 rounded-b-3xl flex items-center justify-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-2xl" />
        </div>
        <div className="relative z-10">
          <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
            <FiMapPin className="text-white text-5xl" />
          </div>
        </div>
      </div>

      {/* CARD */}
      <div className="flex-1 px-5 py-8 flex flex-col justify-center">
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">

          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Enable Location Access
            </h1>

            <p className="text-gray-500 text-sm mt-3">
              Location is required to prevent fraud and verify your working status
            </p>
          </div>

          {/* FEATURES */}
          <div className="space-y-4">

            <div className="flex gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-600">
                  <IoShieldCheckmarkOutline className="text-white text-lg" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Fraud Prevention</p>
                <p className="text-gray-600 text-xs mt-1">
                  Ensures genuine claims from verified locations
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-teal-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-teal-600">
                  <MdOutlineLocationOn className="text-white text-lg" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Verify Working Status</p>
                <p className="text-gray-600 text-xs mt-1">
                  Confirms you're actively delivering orders
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-amber-600">
                  <AiOutlineWarning className="text-white text-lg" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Weather Tracking</p>
                <p className="text-gray-600 text-xs mt-1">
                  Detects disruptions in your work area
                </p>
              </div>
            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={getLocation}
            disabled={loading}
            className="w-full py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                Enable Location
                <FiArrowRight className="text-lg" />
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Your location is never stored or shared without your permission
          </p>

        </div>
      </div>
    </div>
  );
}