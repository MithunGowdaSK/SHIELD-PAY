const BASE_URL = "http://localhost:5000/api";

const api = {
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