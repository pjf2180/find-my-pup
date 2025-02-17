"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { ReactNode } from "react";

export interface AuthProps {
  children: ReactNode;
}
export function RequiresAuth({ children }: AuthProps) {
  const isAuth = useAuth();
  if (!isAuth) {
    return null;
  }
  return children;
}
