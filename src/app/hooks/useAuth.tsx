"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DOG_SEARCH } from "../api/api.types";

export function useAuth() {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(DOG_SEARCH, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          setIsAuth(true);
        } else if (response.status === 401) {
          setIsAuth(false);
          router.replace("/login"); // Redirect unauthenticated users
        } else {
          console.error(
            `Unexpected error: ${response.status} - ${response.statusText}`
          );
        }
      } catch (error) {
        console.error("Failed to check auth:", error);
        setIsAuth(false); // Ensure state is updated even on error
      }
    };

    checkAuth();
  }, [router]);

  return isAuth;
}
