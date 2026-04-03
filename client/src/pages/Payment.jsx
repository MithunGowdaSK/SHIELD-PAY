import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/hero.png";
import { getData, saveData } from "../utils/storage";
import {
  FiArrowLeft,
  FiSmartphone,
  FiCreditCard,
} from "react-icons/fi";
import { BsWallet2 } from "react-icons/bs";

export default function Payment() {
  const navigate = useNavigate();

  // ✅ SAFE PLAN LOAD (NO CRASH)
  let plan = { name: "Standard", price: 50 };

  try {
    const stored = localStorage.getItem("plan");
    if (stored && stored !== "undefined") {
      plan = JSON.parse(stored);
    }
  } catch (err) {
    console.log("Plan parse error:", err);
  }

  const [method, setMethod] = useState("upi");

  // 🎯 coverage logic
  let coverage = 0;
  if (plan.price === 30) coverage = 1000;
  else if (plan.price === 50) coverage = 2000;
  else if (plan.price === 80) coverage = 3500;

  // ✅ HANDLE PAYMENT
  const handlePay = () => {
    const data = getData();

    data.plan = {
      name: plan.name + " Plan",
      price: plan.price,
      coverage,
    };

    localStorage.setItem("planStart", new Date().toISOString());

    saveData(data);

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* 🔥 HEADER */}
      <div className="h-[240px] bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 rounded-b-[40px] px-5 pt-6">

        <button onClick={() => navigate(-1)} className="text-white mb-4">
          <FiArrowLeft size={20} />
        </button>

        <div className="flex justify-center">
          <img
            src={logo}
            className="w-28 bg-white p-2 rounded-lg shadow"
            alt="logo"
          />
        </div>

        <h1 className="text-white text-xl font-semibold text-center mt-4">
          Payment
        </h1>

        <p className="text-white text-sm text-center opacity-90">
          Secure your coverage now
        </p>
      </div>

      {/* 💳 BODY */}
      <div className="-mt-14 px-5 pb-10">

        {/* PLAN CARD */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-400 text-white p-5 rounded-2xl shadow-lg mb-5">

          <p className="text-sm opacity-80">You're purchasing</p>

          <h2 className="text-lg font-semibold mt-1">
            {plan.name} Plan
          </h2>

          <div className="border-t border-white/30 my-3" />

          <div className="flex justify-between items-center">
            <p className="text-sm">Weekly Premium</p>

            <p className="text-2xl font-bold">
              ₹{plan.price}
              <span className="text-sm font-normal">/week</span>
            </p>
          </div>

        </div>

        {/* PAYMENT METHODS */}
        <div className="bg-white rounded-2xl shadow-xl p-5">

          <h2 className="font-semibold mb-4">
            Select Payment Method
          </h2>

          {/* UPI */}
          <div
            onClick={() => setMethod("upi")}
            className={`flex items-center justify-between p-4 rounded-xl border mb-3 cursor-pointer transition
            ${method === "upi"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${
                method === "upi" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}>
                <FiSmartphone />
              </div>

              <div>
                <p className="font-medium">UPI</p>
                <p className="text-xs text-gray-500">
                  PhonePe, GPay, Paytm
                </p>
              </div>
            </div>

            {method === "upi" && <span className="text-blue-500">✔</span>}
          </div>

          {/* CARD */}
          <div
            onClick={() => setMethod("card")}
            className={`flex items-center justify-between p-4 rounded-xl border mb-3 cursor-pointer
            ${method === "card"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${
                method === "card" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}>
                <FiCreditCard />
              </div>

              <div>
                <p className="font-medium">Card</p>
                <p className="text-xs text-gray-500">
                  Credit / Debit Cards
                </p>
              </div>
            </div>

            {method === "card" && <span className="text-blue-500">✔</span>}
          </div>

          {/* WALLET */}
          <div
            onClick={() => setMethod("wallet")}
            className={`flex items-center justify-between p-4 rounded-xl border mb-4 cursor-pointer
            ${method === "wallet"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${
                method === "wallet" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}>
                <BsWallet2 />
              </div>

              <div>
                <p className="font-medium">Wallet</p>
                <p className="text-xs text-gray-500">
                  Paytm Wallet, PhonePe Wallet
                </p>
              </div>
            </div>

            {method === "wallet" && <span className="text-blue-500">✔</span>}
          </div>

          {/* INPUTS */}
          {method === "upi" && (
            <>
              <label className="text-sm font-medium">UPI ID</label>
              <input
                placeholder="yourname@upi"
                className="w-full mt-2 mb-4 p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}

          {method === "card" && (
            <>
              <label className="text-sm font-medium">Card Number</label>
              <input
                placeholder="1234 5678 9012 3456"
                className="w-full mt-2 mb-4 p-3 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-3 mb-4">
                <input
                  placeholder="MM/YY"
                  className="w-1/2 p-3 rounded-lg bg-gray-100 outline-none"
                />
                <input
                  placeholder="CVV"
                  className="w-1/2 p-3 rounded-lg bg-gray-100 outline-none"
                />
              </div>
            </>
          )}

          {method === "wallet" && (
            <>
              <label className="text-sm font-medium">Mobile Number</label>
              <input
                placeholder="Enter mobile number"
                className="w-full mt-2 mb-4 p-3 rounded-lg bg-gray-100 outline-none"
              />
            </>
          )}

          {/* AUTO RENEW */}
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm mb-4">
            <p className="font-medium">Auto-renewal enabled</p>
            <p className="text-xs">
              Your coverage renews weekly automatically.
            </p>
          </div>

          {/* PAY BUTTON */}
          <button
            onClick={handlePay}
            className="w-full py-3 rounded-xl text-white font-semibold
            bg-gradient-to-r from-blue-500 to-teal-400 shadow-md active:scale-[0.98]"
          >
            Pay ₹{plan.price} Now
          </button>

        </div>

        {/* FOOTER */}
        <p className="text-xs text-gray-400 text-center mt-4">
          🔒 Secured with 256-bit encryption
        </p>

      </div>
    </div>
  );
}

