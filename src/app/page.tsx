"use client";

import { useMemo, useState } from "react";
import { LoginForm } from "./_components/login-form";
import { useAuth } from "@/context/use-auth";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "./api/axios/interceptors";
import { CustomError } from "@/types/ApiError";

export default function LoginPage() {
  const { startSession } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isApiCalling, setIsApiCalling] = useState<boolean>(false);
  const { toast } = useToast();

  const isLoginButtonActive = useMemo(() => {
    if (email.trim() === "" || password.trim() === "") {
      return false;
    }
    return true;
  }, [email, password]);

  const login = async (email: string, password: string) => {
    setIsApiCalling(true);

    try {
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });
      const user = response.data.user;

      console.log("Response: ", user);
      startSession(user);
    } catch (error) {
      const handledError = error as CustomError;

      console.log("Handled Error: ", handledError);

      toast({
        variant: "destructive",
        description: handledError.message,
      });

      if (handledError.validationErrors) {
        console.log("Validation Errors: ", handledError.validationErrors);
      }
    } finally {
      setIsApiCalling(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          isLoading={isApiCalling}
          buttonState={isLoginButtonActive}
          login={login}
        />
      </div>
    </div>
  );
}
