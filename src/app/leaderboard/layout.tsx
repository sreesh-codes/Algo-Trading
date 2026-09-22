import React from "react";
import { Gatekeeper } from "@/components/competition/Gatekeeper";

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return <Gatekeeper>{children}</Gatekeeper>;
}
