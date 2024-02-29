"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TaskForm } from "@/components/task-form";
import { useEffect, useState } from "react";
import { Task } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { TASK_COLLECTION } from "@/constants";
import { db } from "@/firebase";

export default function UpdateTaskPage(props: { params: { taskId: string } }) {
  const { taskId } = props.params;

  const [defaultValues, setDefaultValues] = useState();
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const querySnapshot = await getDoc(doc(db, TASK_COLLECTION, taskId));
        setDefaultValues({
          ...querySnapshot.data(),
          dueDate: querySnapshot.data()?.dueDate.toDate(),
        } as any);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTask();
  }, []);
  return (
    <main className="flex min-h-screen p-4 gap-x-4">
      <Link href="/dashboard">
        <Button variant="secondary">Back</Button>
      </Link>

      <div className="flex-1 flex flex-col items-center">
        <h2 className="text-3xl font-semibold">Update task</h2>

        <TaskForm type="update" defaultValues={defaultValues} taskId={taskId} />
      </div>
    </main>
  );
}
