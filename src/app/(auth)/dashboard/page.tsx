"use client";

import { Button } from "@/components/ui/button";
import { TASK_COLLECTION } from "@/constants";
import { db } from "@/firebase";
import { Task } from "@/types";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const statusFilterValues = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "todo",
    label: "To do",
  },
  {
    id: "progress",
    label: "In progress",
  },
  {
    id: "completed",
    label: "Completed",
  },
];

export default function AllTasksPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    // fetching tasks from firebase database.
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, TASK_COLLECTION));
        let tempTask: Task[] = [];
        querySnapshot.forEach((doc) => {
          tempTask.push({
            ...doc.data(),
            id: doc.id,
            dueDate: doc.data().dueDate.toDate(),
          } as Task);
        });
        setTasks(tempTask);
        if (!!searchParams.get("status")) {
          setFilteredTasks(
            filterByStatus(searchParams.get("status") as string, tempTask)
          );
        } else {
          setFilteredTasks(tempTask);
        }
        console.log(tempTask);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTasks();
  }, []);

  const filterByStatus = (filterId: string, argTasks: Task[]) => {
    if (filterId === "all") return argTasks;
    return argTasks.filter((task) => task.status === filterId);
  };

  const handleSetFilter = (filterId: string) => {
    setFilteredTasks(filterByStatus(filterId, tasks));
    router.push(`${pathname}?${createQueryString("status", filterId)}`);
  };

  return (
    <main className="min-h-screen flex justify-center pt-6">
      {/* all tasks page */}
      <div className="flex flex-col lg:w-[1000px] md:w-[700px] w-[320px]">
        <h2 className="text-3xl font-semibold mb-6">Tasks</h2>
        <section className="flex flex-col gap-y-4">
          <h3 className="text-xl font-semibold">Filter by status</h3>
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {statusFilterValues.map((statusFilterValue) => (
                <Button
                  variant={
                    searchParams.get("status") === statusFilterValue.id
                      ? "default"
                      : "secondary"
                  }
                  onClick={() => {
                    handleSetFilter(statusFilterValue.id);
                  }}
                >
                  {statusFilterValue.label}
                </Button>
              ))}
            </div>
            <Link href="/dashboard/new-task">
              <Button variant="secondary">Add new task</Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
