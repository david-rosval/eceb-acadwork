"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

type UserInfo = {
  id: string;
  firstName: string;
  lastName: string;
}

type AuthContextType = {
  accessToken: string | null;
  user: UserInfo | null;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null)
  const router = useRouter();

  const login = (token: string) => {
    setAccessToken(token);
  };

  const logout = useCallback(async () => {
    setAccessToken(null);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }, [router]);

  const refreshToken = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        const { accessToken, user } = await res.json();
        setAccessToken(accessToken);
        setUser(user)
      } else {
        setAccessToken(null);
        setUser(null)
      }
    } catch {
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    // Intenta refrescar el token al montar la app
    refreshToken();
  }, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        login,
        logout,
        refreshToken,
        isAuthenticated: !!accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
