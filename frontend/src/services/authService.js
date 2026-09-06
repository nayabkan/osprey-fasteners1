import api from "./api";


// =====================================================
// REGISTER
// =====================================================

export const registerUser = async (userData) => {
  const response = await api.post(
    "/api/auth/register",
    userData
  );

  return response.data;
};


// =====================================================
// LOGIN
// =====================================================

export const loginUser = async (userData) => {
  const response = await api.post(
    "/api/auth/login",
    userData
  );

  const { access_token } = response.data;

  localStorage.setItem(
    "access_token",
    access_token
  );

  return response.data;
};


// =====================================================
// CURRENT USER
// =====================================================

export const getCurrentUser = async () => {
  const response = await api.get(
    "/api/users/me"
  );

  return response.data;
};


// =====================================================
// LOGOUT
// =====================================================

export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};