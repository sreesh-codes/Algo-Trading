"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();

  // On the landing page route (/), avoid CSS transform animations that create a
  // containing block and prevent position: fixed elements from attaching to the viewport.
  if (pathname === "/") {
    return <div className="flex-1 flex flex-col w-full">{children}</div>;
  }

  return (
    <div key={pathname} className="animate-page-enter flex-1 flex flex-col w-full">
      {children}
    </div>
  );
};
