"use client";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { Fragment, ReactNode, useEffect } from "react";

export type ClientApplicationProps = {
  children: ReactNode;
};
export const ClientApplication = (props: ClientApplicationProps) => {
  const { children } = props;
  const router = useRouter();

  /* authentication redirect logic */
  const handleLoginRedirect = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
      } else {
        router.replace("/login");
      }
    });
  };

  useEffect(() => {
    handleLoginRedirect();
  }, []);
  return <Fragment>{children}</Fragment>;
};
