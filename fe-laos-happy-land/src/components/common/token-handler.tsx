"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/share/store/auth.store";

export default function TokenHandler() {
  const searchParams = useSearchParams();
  const { handleGoogleCallback } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (token) {
      // Process the Google callback token
      handleGoogleCallback(token).catch((error) => {
        console.error("Token handling error:", error);
      });
    }
  }, [searchParams, handleGoogleCallback]);

  // This component doesn't render anything
  return null;
}
