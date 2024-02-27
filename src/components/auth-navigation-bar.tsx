import React from "react";
import { Button } from "./ui/button";

export const AuthNavigationBar = () => {
  return (
    <nav className="flex justify-between px-4 py-2 items-center border-slate-900/10 border-b mb-4">
      <h3 className="text-2xl font-bold">Task Tracker</h3>

      <div className="flex gap-x-4 items-center">
        <Button variant="secondary">Sign out</Button>
        <p>Avatar</p>
      </div>
    </nav>
  );
};
