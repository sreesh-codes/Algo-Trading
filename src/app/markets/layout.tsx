import React from "react";
import { Gatekeeper } from "@/components/competition/Gatekeeper";

export default function MarketsLayout({ children }: { children: React.ReactNode }) {
  return <Gatekeeper>{children}</Gatekeeper>;
}
