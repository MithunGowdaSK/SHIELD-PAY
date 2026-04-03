const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
const api = {
  // ✅ USER MANAGEMENT
  registerUser: async (phone, name, city) => {
    const res = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, name, city }),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  },

  getUserByPhone: async (phone) => {
    const res = await fetch(`${BASE_URL}/users/phone/${phone}`);
    const data = await res.json();
    return { ok: res.ok, data };
  },

  updateUserProfile: async (phone, updates) => {
    const res = await fetch(`${BASE_URL}/users/${phone}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  },

  // ✅ ORDERS
  addOrder: async (phone, orderId, amount, latitude, longitude, platform) => {
    const res = await fetch(`${BASE_URL}/users/${phone}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, amount, latitude, longitude, platform }),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  },

  getUserOrders: async (phone) => {
    const res = await fetch(`${BASE_URL}/users/${phone}/orders`);
    const data = await res.json();
    return { ok: res.ok, data };
  },

  // ✅ PAYOUTS
  addPayout: async (phone, payoutId, amount, triggeredBy) => {
    const res = await fetch(`${BASE_URL}/users/${phone}/payouts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payoutId, amount, triggeredBy }),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  },

  getUserPayouts: async (phone) => {
    const res = await fetch(`${BASE_URL}/users/${phone}/payouts`);
    const data = await res.json();
    return { ok: res.ok, data };
  },

  // ✅ PLAN
  updateUserPlan: async (phone, planName, planPrice, coverage) => {
    const res = await fetch(`${BASE_URL}/users/${phone}/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planName, planPrice, coverage }),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  },

  // ✅ WALLET
  updateWallet: async (phone, amount, reason) => {
    const res = await fetch(`${BASE_URL}/users/${phone}/wallet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, reason }),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  },

  // ✅ PLATFORM
  registerPlatformForm: async (formData) => {
    const res = await fetch(`${BASE_URL}/platform`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    return {
      ok: res.ok,
      status: res.status,
      data,
    };
  },

  postLocation: async (data) => {
    return fetch(`${BASE_URL}/users/location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
};

export default api;