import type { ReactNode } from "react";
import { Header } from "@/components/header";

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      {children}
    </div>
  );
}
