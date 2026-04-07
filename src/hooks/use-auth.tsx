import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { User } from "@/lib/supabase-helpers";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  signOut: () => void;
};

type RegisterData = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
};

const AuthContext = createContext<AuthCtx>({
  user: null, loading: true,
  login: async () => {}, register: async () => {}, signOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    api("/users/me")
      .then(setUser)
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("token", token);
    setUser(user);
  };

  const register = async (data: RegisterData) => {
    const { token, user } = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    localStorage.setItem("token", token);
    setUser(user);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
