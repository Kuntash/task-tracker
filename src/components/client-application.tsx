"use client";
import { UserContextProvider } from "@/context/user-context";
import { auth } from "@/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { Fragment, ReactNode, useEffect, useState } from "react";

export type ClientApplicationProps = {
  children: ReactNode;
};
export const ClientApplication = (props: ClientApplicationProps) => {
  const { children } = props;
  const router = useRouter();
  const [user, setUser] = useState<User>();
  /* authentication redirect logic */
  const handleLoginRedirect = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.replace("/login");
      }
    });
  };

  useEffect(() => {
    handleLoginRedirect();
  }, []);
  return (
    <UserContextProvider
      value={{
        id: user?.uid ?? "",
      }}
    >
      {children}
    </UserContextProvider>
  );
};
