import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/hero.png";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { useApp } from "../context/useApp";
import { getData, saveData } from "../utils/storage";
import toast from "react-hot-toast";

export default function Orders() {
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [orders, setOrders] = useState(() => {
    const data = getData();
    return data.orders || [];
  });
  const { coords } = useApp();

  // note: orders initialized from local storage above

  // ➕ ADD ORDER
  const handleAddOrder = () => {
    if (!orderId || !amount) {
      toast.error("Fill all details");
      return;
    }

    // require location permission to prevent false claims
    if (!coords) {
      toast.error("Enable location permission before adding orders.");
      return;
    }

    const newOrder = {
      id: orderId,
      amount: Number(amount),
      date: new Date().toISOString(),
      latitude: coords?.latitude || null,
      longitude: coords?.longitude || null,
    };

    // Use your utility to sync storage
    const data = getData();
    if (!data.orders) data.orders = [];
    
    data.orders.push(newOrder);
    saveData(data); // Syncs to localStorage via your util
    setOrders([...data.orders]); // Update UI state

    // send to server for centralized storage/verification
    fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        phone: localStorage.getItem("phone"), 
        orderId: newOrder.id, 
        amount: newOrder.amount, 
        date: newOrder.date, 
        platform: localStorage.getItem("platform") || null, 
        latitude: newOrder.latitude, 
        longitude: newOrder.longitude 
      }),
    }).then(() => {
      toast.success("Order added ✅");
    }).catch(() => {
      toast.error("Failed to sync order to server");
    });

    setOrderId("");
    setAmount("");
  };

  // 📊 TODAY + WEEK CALCULATIONS
  const today = new Date();

  const todayOrders = orders.filter(
    (o) => new Date(o.date).toDateString() === today.toDateString()
  );

  const todayTotal = todayOrders.reduce((sum, o) => sum + o.amount, 0);

  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 7);

  const weeklyOrders = orders.filter(
    (o) => new Date(o.date) >= weekAgo
  );

  const weeklyTotal = weeklyOrders.reduce((sum, o) => sum + o.amount, 0);

  // weekly average (per day) used for simple payout suggestions
  const weeklyAvg = Math.round(weeklyTotal / 7) || 0;

  const [suggestedTopUp, setSuggestedTopUp] = useState(null);

  const calculateSuggestedTopUp = () => {
    const diff = Math.max(0, weeklyAvg - todayTotal);
    setSuggestedTopUp(diff);
  };

  // 📅 GROUP BY DATE
  const grouped = orders.reduce((acc, order) => {
    const date = new Date(order.date).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-blue-600 to-teal-400 rounded-b-[40px] p-5 text-white text-center">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate(-1)}>
            <FiArrowLeft size={20} />
          </button>
        </div>
        <div className="flex justify-center">
          <img src={logo} className="w-28 bg-white p-2 rounded shadow" alt="Logo" />
        </div>
        <h1 className="text-xl font-semibold mt-4">Order Tracking</h1>
        <p className="text-sm opacity-90">Track your deliveries & earnings</p>
      </div>

      <div className="px-5 -mt-10">
        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-blue-600 text-white rounded-xl p-4 shadow">
            <p className="text-xs opacity-80">Today</p>
            <h2 className="text-lg font-semibold">₹{todayTotal}</h2>
            <p className="text-xs">{todayOrders.length} orders</p>
          </div>
          <div className="bg-teal-500 text-white rounded-xl p-4 shadow">
            <p className="text-xs opacity-80">This Week</p>
            <h2 className="text-lg font-semibold">₹{weeklyTotal}</h2>
            <p className="text-xs">{weeklyOrders.length} orders</p>
          </div>
          <div className="col-span-2 bg-white rounded-xl p-3 shadow flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Weekly average (per day)</p>
              <h3 className="text-lg font-semibold">₹{weeklyAvg}</h3>
              <p className="text-xs text-gray-500">Based on last 7 days</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Today's total</p>
              <h3 className="text-lg font-semibold">₹{todayTotal}</h3>
              <button
                onClick={calculateSuggestedTopUp}
                className="mt-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Calculate suggested top-up
              </button>
              {suggestedTopUp !== null && (
                <p className="text-sm mt-2 text-green-600">Suggested top-up: ₹{suggestedTopUp}</p>
              )}
            </div>
          </div>
        </div>

        {/* ADD ORDER FORM */}
        <div className="bg-white rounded-xl p-5 shadow mb-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <FiPlus /> Add New Order
          </h2>
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g., ZOM-12345"
            className="w-full mb-3 p-3 rounded-lg bg-gray-100 outline-none"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter earning"
            className="w-full mb-4 p-3 rounded-lg bg-gray-100 outline-none"
          />
          <button
            onClick={handleAddOrder}
            className="w-full py-3 rounded-lg text-white font-medium bg-blue-600"
          >
            + Add Order
          </button>
        </div>

        {/* ORDER HISTORY */}
        {/* SETTLEMENT / PAYOUT STEPS (compact) */}
        <div className="mt-4 mb-5">
          <h3 className="font-semibold mb-2">Settlement — how it works</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-white rounded-lg p-3 shadow">
              <p className="font-medium">1. Trigger confirmed</p>
              <p className="text-xs text-gray-500">Oracle/weather confirms event threshold</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow">
              <p className="font-medium">2. Worker eligibility check</p>
              <p className="text-xs text-gray-500">Active policy, correct zone, no duplicate claim</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow">
              <p className="font-medium">3. Payout calculated</p>
              <p className="text-xs text-gray-500">Fixed amount per day × number of trigger days</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div className="bg-white rounded-lg p-3 shadow">
              <p className="font-medium">4. Transfer initiated</p>
              <p className="text-xs text-gray-500">UPI / IMPS / bank (instant preferred)</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow">
              <p className="font-medium">5. Record updated</p>
              <p className="text-xs text-gray-500">Logs & reconciliation recorded</p>
            </div>
          </div>
        </div>

        {/* PRICING / ACTUARIAL NOTES */}
        <div className="bg-white rounded-xl p-4 shadow mb-5">
          <h3 className="font-semibold mb-2">Pricing notes</h3>
          <ul className="text-sm text-gray-600 list-disc pl-5">
            <li>Target range: ₹20–₹50 per worker per week (example)</li>
            <li>Weekly cycle matches payout rhythm — weekly is preferred to monthly</li>
            <li>Weekly premium = trigger probability × avg income lost per day × days exposed</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl p-5 shadow">
          <h2 className="font-semibold mb-4">Order History</h2>
          {Object.keys(grouped).length === 0 ? (
            <p className="text-gray-400 text-sm text-center">No orders yet</p>
          ) : (
            Object.keys(grouped).reverse().map((date) => (
              <div key={date} className="mb-4">
                <p className="text-sm text-gray-500 mb-2">{date}</p>
                {grouped[date].map((o, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-100 rounded-lg p-3 mb-2">
                    <div>
                      <p className="font-medium text-sm">{o.id}</p>
                      <p className="text-[10px] text-gray-500">
                        {new Date(o.date).toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="text-green-600 font-semibold text-sm">+₹{o.amount}</p>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}