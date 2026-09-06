import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});


// =====================================================
// JWT TOKEN
// =====================================================

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "access_token"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;
  },

  (error) => {

    return Promise.reject(error);

  }
);


// =====================================================
// 401 HANDLER
// =====================================================

api.interceptors.response.use(

  (response) => {

    return response;

  },

  (error) => {

    if (
      error.response?.status === 401
    ) {

      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "user"
      );

    }

    return Promise.reject(error);

  }
);


export default api;