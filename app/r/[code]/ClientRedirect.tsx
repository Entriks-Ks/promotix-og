"use client";
import { useEffect } from "react";

export default function ClientRedirect({ to }: { to: string }) {
  useEffect(() => {
    if (to) window.location.replace(to);
  }, [to]);
  return <p>Redirecting...</p>;
}
