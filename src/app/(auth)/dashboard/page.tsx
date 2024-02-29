"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { TASK_COLLECTION } from "@/constants";
import { useUserContext } from "@/context/user-context";
import { auth, db } from "@/firebase";
import { Column, Task } from "@/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

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

const statusMap = {
  all: "All",
  todo: "To do",
  progress: "In progress",
  completed: "Completed",
};

const taskColumns: Column[] = [
  {
    id: "renderId",
    label: "Id",
  },
  {
    id: "title",
    label: "Title",
  },
  {
    id: "description",
    label: "Description",
  },
  {
    id: "status",
    label: "Status",
  },
  {
    id: "dueDate",
    label: "Due date",
  },
];

export default function AllTasksPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useUserContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchString, setSearchString] = useState("");

  const filterByStatus = (filterId: string, argTasks: Task[]) => {
    if (filterId === "all") return argTasks;
    return argTasks.filter((task) => task.status === filterId);
  };

  const formattedTasks = useMemo(() => {
    let tempTasks: any[];
    if (!!searchParams.get("status")) {
      tempTasks = filterByStatus(searchParams.get("status") as string, tasks);
    } else {
      tempTasks = tasks;
    }

    if (!!searchString)
      tempTasks = tempTasks.filter((task) => {
        const texts = [task.title, task.description].join(" ").toLowerCase();
        return texts.includes(searchString.toLowerCase());
      });

    return tempTasks?.map((task) => {
      return {
        renderId: task.id.substring(0, 4),
        id: task.id,
        dueDate: format(task.dueDate, "MMM dd"),
        title: task.title,
        ...(task.description && {
          description:
            task?.description?.length > 50
              ? `${task.description.substring(0, 50)}...`
              : task.description,
        }),
        status: statusMap?.[task.status as keyof typeof statusMap],
      };
    });
  }, [tasks, searchString, searchParams]);

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
        const q = query(
          collection(db, TASK_COLLECTION),
          where("createdBy", "==", user?.id)
        );
        const querySnapshot = await getDocs(q);
        let tempTask: Task[] = [];
        querySnapshot.forEach((doc) => {
          tempTask.push({
            ...doc.data(),
            id: doc.id,
            dueDate: doc.data().dueDate.toDate(),
          } as Task);
        });
        setTasks(tempTask);
      } catch (error) {
        console.log(error);
      }
    };

    if (!!user?.id) fetchTasks();
  }, [user]);

  const handleSetFilter = (filterId: string) => {
    router.push(`${pathname}?${createQueryString("status", filterId)}`);
  };

  return (
    <main className="min-h-screen flex justify-center pt-6">
      {/* all tasks page */}
      <div className="flex flex-col lg:w-[1000px] md:w-[700px] sm:w-[480px] w-[320px]">
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

              <Input
                placeholder="Search task"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value as string)}
              />
            </div>
          </div>

          {formattedTasks?.length > 0 && (
            <DataTable columns={taskColumns} data={formattedTasks} />
          )}
        </section>
      </div>
    </main>
  );
}
