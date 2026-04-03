import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getData, saveData } from "../utils/storage";

export default function Payout() {
  const navigate = useNavigate();

  const [txn, setTxn] = useState("");
  const [dateTime, setDateTime] = useState("");

  const data = getData();
  const orders = data.orders || [];
  const plan = data.plan || { coverage: 0, name: "Standard Coverage" };

  const today = new Date().toDateString();

  // 💰 TODAY EARNINGS
  const todayEarnings = orders
    .filter((o) => new Date(o.date).toDateString() === today)
    .reduce((sum, o) => sum + Number(o.amount), 0);

  // 📊 AVG
  const grouped = {};
  orders.forEach((o) => {
    const d = new Date(o.date).toDateString();
    if (!grouped[d]) grouped[d] = 0;
    grouped[d] += Number(o.amount);
  });

  const dates = Object.keys(grouped);

  const avg =
    dates.length > 1
      ? dates.reduce((sum, d) => sum + grouped[d], 0) / dates.length
      : 0;

  // 💸 LOSS
  const loss = Math.max(avg - todayEarnings, 0);

  // 💰 FINAL PAYOUT
  const payout = Math.min(loss, plan.coverage);

  useEffect(() => {
    // 🔥 GENERATE REAL DATA
    const id = "TXN" + Date.now();
    setTxn(id);

    const now = new Date().toLocaleString("en-IN");
    setDateTime(now);

    // 💾 SAVE TO STORAGE (IMPORTANT)
    const updated = {
      ...data,
      wallet: (data.wallet || 0) + payout,
      payouts: [
        ...(data.payouts || []),
        {
          id,
          amount: payout,
          date: now,
          status: "completed",
        },
      ],
    };

    saveData(updated);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-400 text-white p-6 pb-16 rounded-b-[40px] text-center shadow-lg">

        <h1 className="text-2xl font-bold animate-fade">
          Payout Successful!
        </h1>

        <p className="text-sm opacity-90">
          Instant compensation disbursed via UPI
        </p>

      </div>

      {/* CONTENT */}
      <div className="-mt-10 px-5 pb-10 space-y-4">

        {/* AMOUNT */}
        <div className="bg-white rounded-2xl p-5 shadow text-center animate-slide-up">

          <h1 className="text-3xl font-bold">
            ₹{Math.round(payout)}
          </h1>

          <p className="text-xs text-gray-500 mt-2">
            Payment secured by ShieldPay
          </p>

        </div>

        {/* DETAILS */}
        <div className="bg-white rounded-2xl p-5 shadow space-y-3 animate-slide-up">

          <h2 className="font-semibold">
            Transaction Details
          </h2>

          <div className="flex justify-between text-sm">
            <span>Transaction ID</span>
            <span className="font-medium text-blue-600">{txn}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Date & Time</span>
            <span>{dateTime}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Trigger Event</span>
            <span>Weather Disruption</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Plan Applied</span>
            <span className="text-blue-600">{plan.name}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Status</span>
            <span className="text-green-600">● Completed</span>
          </div>

        </div>

        {/* AI SUMMARY */}
        <div className="bg-blue-50 rounded-2xl p-5 shadow animate-slide-up">

          <h2 className="font-semibold mb-2">
            AI Calculation Summary
          </h2>

          <ul className="text-sm space-y-1">
            <li>• Typical earnings: ₹{Math.round(avg)}</li>
            <li>• Today earnings: ₹{todayEarnings}</li>
            <li>• Income loss: ₹{Math.round(loss)}</li>
          </ul>

        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-3 bg-black text-white rounded-xl active:scale-95 transition"
        >
          Return to Dashboard
        </button>

      </div>

      {/* ANIMATIONS */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade {
          animation: fadeIn 0.5s ease;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease;
        }
      `}
      </style>

    </div>
  );
}