"use client";

import React from "react";
import { Button } from "./ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const AuthNavigationBar = () => {
  const router = useRouter();
  const handleSignout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="flex justify-between px-4 py-2 items-center border-slate-900/10 border-b mb-4">
      <h3 className="text-2xl font-bold">Task Tracker</h3>

      <div className="flex gap-x-4 items-center">
        <Link href="/dashboard/new-task">
          <Button variant="secondary">Add new task</Button>
        </Link>
        <Button variant="secondary" onClick={handleSignout}>
          Sign out
        </Button>
      </div>
    </nav>
  );
};
