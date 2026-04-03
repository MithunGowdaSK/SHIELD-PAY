import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/hero.png";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate("/register");
    }, 3000);

    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center relative z-10">

        {/* 🔥 BIG LOGO */}
        <div className="bg-white p-6 rounded-3xl shadow-2xl animate-scale-in">

          <img
            src={logo}
            alt="ShieldPay Logo"
            className="w-40 h-32 object-contain animate-glow"
          />

        </div>

        {/* APP NAME */}
        <h1 className="text-white text-4xl font-bold mt-8 tracking-wide animate-fade-in">
          ShieldPay
        </h1>

        {/* 🔥 INSURANCE QUOTE */}
        <p className="text-white/90 text-center text-sm mt-3 px-6 animate-fade-in delay-200">
          “Protecting your income, even when the weather doesn't.”
        </p>

        {/* SUBTEXT */}
        <p className="text-white/70 text-xs mt-2 animate-fade-in delay-300">
          AI-powered parametric insurance for gig workers
        </p>

        {/* LOADER */}
        <div className="mt-10 flex gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-400" />
        </div>

      </div>

      {/* 🔥 ANIMATIONS */}
      <style>
        {`
        @keyframes scaleIn {
          0% { transform: scale(0.6); opacity: 0 }
          100% { transform: scale(1); opacity: 1 }
        }

        @keyframes glow {
          0% { filter: drop-shadow(0 0 0px rgba(255,255,255,0.3)); }
          100% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.6)); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-scale-in {
          animation: scaleIn 0.7s ease forwards;
        }

        .animate-glow {
          animation: glow 1.5s ease-in-out infinite alternate;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease forwards;
        }

        .delay-200 { animation-delay: 0.2s }
        .delay-300 { animation-delay: 0.3s }
        .delay-400 { animation-delay: 0.4s }
      `}
      </style>

    </div>
  );
}