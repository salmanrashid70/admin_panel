"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types/auth.data";
// import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isCheckingAuth: boolean;
  startSession: (user: User) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  // const { toast } = useToast();

  // Check authentication status on initial load
  const checkAuth = useCallback(() => {
    console.log("Checking auth");
    setIsCheckingAuth(true);

    const storedUser = localStorage.getItem("admin-user");
    const sessionExpiry = localStorage.getItem("session-expiry");

    if (storedUser && sessionExpiry && Date.now() < Number(sessionExpiry)) {
      setUser(JSON.parse(storedUser));

      if (pathname === "/") {
        router.replace("/dashboard");
      }
    } else {
      localStorage.removeItem("admin-user");
      localStorage.removeItem("session-expiry");
      router.replace("/");
    }
    setIsCheckingAuth(false);
  }, [router, pathname]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Logout function
  const logout = useCallback(async () => {
    localStorage.removeItem("admin-user");
    localStorage.removeItem("session-expiry");
    setUser(null);
    router.replace("/");
  }, [router]);

  // Login function
  const startSession = async (user: User) => {
    console.log(user);
    try {
      localStorage.setItem("admin-user", JSON.stringify(user));

      // await loginApiCall(email, password);

      localStorage.setItem(
        "session-expiry",
        String(Date.now() + 30 * 60 * 1000)
      ); // 30 minutes

      // setUser(fakeUser);
      router.replace("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isCheckingAuth, startSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within AuthProvider");

  return context;
};
