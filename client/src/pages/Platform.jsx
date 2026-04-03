import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiArrowLeft } from "react-icons/fi";
import useLocation from "../hooks/useLocation";
import { useApp } from "../context/useApp";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Platform() {
  const navigate = useNavigate();
  const { coords, error } = useLocation();
  const { setCoords } = useApp();

  const [selected, setSelected] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const platforms = [
    { name: "Zomato", color: "border-red-400 bg-red-50" },
    { name: "Swiggy", color: "border-orange-400 bg-orange-50" },
    { name: "Zepto", color: "border-purple-400 bg-purple-50" },
    { name: "Amazon", color: "border-yellow-400 bg-yellow-50" },
    { name: "Dunzo", color: "border-blue-400 bg-blue-50 col-span-2" },
  ];

  useEffect(() => {
    if (coords && setCoords) setCoords(coords);
  }, [coords, setCoords]);

  const handleVerify = async () => {
    if (!selected || !workerId || !file) {
      toast.error("Please fill all details");
      return;
    }

    const phone = localStorage.getItem("phone");

    if (!phone) {
      toast.error("User not found. Please login again");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/platform`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          platform: selected,
          workerId,
          latitude: coords?.latitude || null,
          longitude: coords?.longitude || null,
          verified: true
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Failed ❌");
        setLoading(false);
        return;
      }

      toast.success("Platform verified ✅");

      localStorage.setItem("platform", selected);
      localStorage.setItem("workerId", workerId);

      if (coords) {
        api.postLocation({
          phone,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }).catch(() => {});
      }

      setLoading(false);
      navigate("/location");

    } catch (err) {
      console.error(err);
      toast.error("Network error ❌");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">

      {/* HEADER */}
      <div className="h-64 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 rounded-b-3xl px-5 pt-6 shadow-lg relative overflow-hidden flex flex-col">
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-2xl" />
        </div>

        <button onClick={() => navigate(-1)} className="text-white mb-4 hover:opacity-80 transition-opacity p-2 rounded-lg">
          <FiArrowLeft size={24} />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-white text-3xl font-bold text-center">Platform Verification</h1>
          <p className="text-white/90 text-sm text-center mt-2">Select your delivery platform and upload ID proof</p>
        </div>
      </div>

      {/* CARD */}
      <div className="flex-1 px-5 py-8 flex flex-col">
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Select Your Platform</h2>

            <div className="grid grid-cols-2 gap-3">
              {platforms.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(p.name)}
                  className={`p-5 rounded-2xl border-2 text-center font-semibold transition-all duration-300 ${
                    selected === p.name
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/30 shadow-md"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-sm"
                  } ${p.name === "Dunzo" ? "col-span-2" : ""}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-3">Worker ID</label>

            <input
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              placeholder="Enter your worker ID"
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-transparent hover:border-blue-200 focus:border-blue-500 focus:outline-none transition-all duration-300"
            />
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-l-4 border-blue-500 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-700">📍 Location Status</p>
            {coords ? (
              <p className="text-xs text-gray-600 mt-1">
                ✅ Location: {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
              </p>
            ) : error ? (
              <p className="text-xs text-red-600 mt-1">❌ Location permission denied</p>
            ) : (
              <p className="text-xs text-amber-600 mt-1">⏳ Fetching location...</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upload ID Proof</h3>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer">

              <input
                type="file"
                id="fileUpload"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <label htmlFor="fileUpload" className="cursor-pointer block">
                <FiUpload className="mx-auto text-4xl mb-3 text-blue-500" />
                <p className="text-sm font-semibold text-gray-800">
                  Click to upload your ID
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Aadhaar, PAN, or Driver's License (JPG, PNG)
                </p>
              </label>

              {file && (
                <p className="text-green-600 text-sm font-semibold mt-4 flex items-center justify-center gap-2">
                  ✅ {file.name}
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs p-4 rounded-xl">
            <p className="font-semibold mb-1">🔒 Your Data is Safe</p>
            <p>Your information is encrypted and used only for verification purposes.</p>
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || !selected || !workerId || !file}
            className="w-full py-4 rounded-2xl text-white font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Platform"
            )}
          </button>

        </div>
      </div>
    </div>
  );
}