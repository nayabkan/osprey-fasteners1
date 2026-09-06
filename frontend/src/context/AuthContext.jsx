import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===================================================
  // RESTORE LOGIN
  // ===================================================

  useEffect(() => {

    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()

      .then((userData) => {

        setUser(userData);

        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );

      })

      .catch(() => {

        logoutUser();
        setUser(null);

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);

  // ===================================================
  // LOGIN
  // ===================================================

  const login = async (email, password) => {

    await loginUser({
      email,
      password,
    });

    const userData = await getCurrentUser();

    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    return userData;
  };

  // ===================================================
  // REGISTER
  // ===================================================

  const register = async (
    full_name,
    email,
    password
  ) => {

    const data = await registerUser({
      email,
      password,
      full_name,
    });

    return data;
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = () => {

    logoutUser();
    setUser(null);

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }

  return context;
};