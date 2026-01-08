import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, getCurrencyFromLocale } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { CurrencyCode, currencies } from "@/lib/currencyUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [homeCurrency, setHomeCurrency] = useState<CurrencyCode>(getCurrencyFromLocale);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pass home currency to login for signup
    login(mode === "signup" ? homeCurrency : undefined);
    
    toast({
      title: mode === "login" ? "Welcome back!" : "Account created!",
      description: mode === "login" 
        ? "You have successfully logged in." 
        : "Your account has been created successfully.",
    });
    
    // Redirect to onboarding for new signups, home for logins
    if (mode === "signup") {
      navigate("/onboarding");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container max-w-lg mx-auto flex h-16 items-center px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {mode === "login" ? "Log In" : "Sign Up"}
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 container max-w-lg mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">K</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-muted-foreground">
            {mode === "login" 
              ? "Log in to continue your journey" 
              : "Start planning your next adventure"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Home Currency Picker - Signup Only */}
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="homeCurrency" className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-muted-foreground" />
                Home Currency
              </Label>
              <Select value={homeCurrency} onValueChange={(val) => setHomeCurrency(val as CurrencyCode)}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.symbol} {c.code} – {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Used to display totals and settlements
              </p>
            </div>
          )}

          <Button type="submit" className="w-full h-12 text-base font-medium rounded-xl">
            {mode === "login" ? "Log In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="ml-1 text-foreground font-medium hover:underline"
            >
              {mode === "login" ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
