import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CurrencyCode } from "@/lib/currencyUtils";

interface User {
  name: string;
  avatar: string;
  homeCurrency: CurrencyCode;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  name: "Alex Chen",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  homeCurrency: "MYR",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = localStorage.getItem("ketravelan-auth");
    return stored === "true";
  });

  const [user, setUser] = useState<User | null>(() => {
    return isAuthenticated ? mockUser : null;
  });

  useEffect(() => {
    localStorage.setItem("ketravelan-auth", String(isAuthenticated));
    setUser(isAuthenticated ? mockUser : null);
  }, [isAuthenticated]);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
