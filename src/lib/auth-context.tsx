import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, setAccessToken } from "./api";
import type { AuthUser } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .post<{ accessToken: string }>("/auth/refresh")
      .then(async (res) => {
        setAccessToken(res.accessToken);
        const { user } = await api.get<{ user: AuthUser }>("/auth/me");
        setUser(user);
      })
      .catch(() => {
        setAccessToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(phone: string, password: string) {
    const res = await api.post<{ accessToken: string; user: AuthUser }>("/auth/login", {
      phone,
      password,
    });
    setAccessToken(res.accessToken);
    setUser(res.user);
    return res.user;
  }

  async function logout() {
    await api.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
