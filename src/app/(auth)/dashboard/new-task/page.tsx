"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TaskForm } from "@/components/task-form";

export default function NewTaskPage() {
  return (
    <main className="flex min-h-screen p-4 gap-x-4">
      <Link href="/dashboard">
        <Button variant="secondary">Back</Button>
      </Link>

      <div className="flex-1 flex flex-col items-center">
        <h2 className="text-3xl font-semibold">New task</h2>

        <TaskForm type="create" />
      </div>
    </main>
  );
}
