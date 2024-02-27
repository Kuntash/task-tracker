import type { Metadata } from "next";
import { ClientApplication } from "@/components/client-application";
import { Fragment } from "react";
import { AuthNavigationBar } from "@/components/auth-navigation-bar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      {/* Navigation bar */}

      <AuthNavigationBar />
      {children}
    </Fragment>
  );
}
