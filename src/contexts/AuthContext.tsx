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
  login: (homeCurrency?: CurrencyCode) => void;
  logout: () => void;
  setHomeCurrency: (currency: CurrencyCode) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const HOME_CURRENCY_KEY = "ketravelan-home-currency";

// Detect currency from browser locale
export function getCurrencyFromLocale(): CurrencyCode {
  try {
    const locale = navigator.language.toLowerCase();
    
    // Malaysian locales
    if (locale.startsWith("ms") || locale.includes("my")) {
      return "MYR";
    }
    // Indonesian
    if (locale.startsWith("id")) {
      return "IDR";
    }
    // US English
    if (locale === "en-us") {
      return "USD";
    }
    // European locales
    if (
      locale.startsWith("de") || 
      locale.startsWith("fr") || 
      locale.startsWith("es") || 
      locale.startsWith("it") ||
      locale.startsWith("nl") ||
      locale.startsWith("pt")
    ) {
      return "EUR";
    }
    
    // Default to MYR for this app
    return "MYR";
  } catch {
    return "MYR";
  }
}

// Get stored home currency or detect from locale
function getInitialHomeCurrency(): CurrencyCode {
  const stored = localStorage.getItem(HOME_CURRENCY_KEY);
  if (stored && ["MYR", "USD", "EUR", "IDR"].includes(stored)) {
    return stored as CurrencyCode;
  }
  return getCurrencyFromLocale();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = localStorage.getItem("ketravelan-auth");
    return stored === "true";
  });

  const [homeCurrency, setHomeCurrencyState] = useState<CurrencyCode>(getInitialHomeCurrency);

  const [user, setUser] = useState<User | null>(() => {
    if (isAuthenticated) {
      return {
        name: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        homeCurrency: getInitialHomeCurrency(),
      };
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem("ketravelan-auth", String(isAuthenticated));
    if (isAuthenticated) {
      setUser({
        name: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        homeCurrency: homeCurrency,
      });
    } else {
      setUser(null);
    }
  }, [isAuthenticated, homeCurrency]);

  const login = (currency?: CurrencyCode) => {
    if (currency) {
      localStorage.setItem(HOME_CURRENCY_KEY, currency);
      setHomeCurrencyState(currency);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const setHomeCurrency = (currency: CurrencyCode) => {
    localStorage.setItem(HOME_CURRENCY_KEY, currency);
    setHomeCurrencyState(currency);
    if (user) {
      setUser({ ...user, homeCurrency: currency });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, setHomeCurrency }}>
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
