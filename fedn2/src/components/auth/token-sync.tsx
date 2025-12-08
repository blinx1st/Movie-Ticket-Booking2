"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function TokenSync() {
  const { data: session } = useSession();

  useEffect(() => {
    const token = (session as any)?.access_token || (session?.user as any)?.access_token;
    if (token && typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }, [session]);

  return null;
}
