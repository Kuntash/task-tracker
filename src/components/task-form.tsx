import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { auth, db } from "@/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { TASK_COLLECTION } from "@/constants";
import { format } from "date-fns";

type TaskFormProps = {
  type: "update" | "create";
  defaultValues?: any;
  taskId?: string;
};

const formSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(1, "Title is required"),
  description: z.string().optional(),
  status: z.string({
    invalid_type_error: "",
    required_error: "Please add a status",
  }),
  dueDate: z.coerce.date({
    errorMap: (issue, ctx) => {
      switch (issue.code) {
        case "invalid_date":
        case "invalid_type":
          return { message: "Please add a due date" };
        default:
          return { message: "Please add a due date" };
      }
    },
  }),
});

export const TaskForm = (props: TaskFormProps) => {
  const { type, defaultValues, taskId } = props;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: !!defaultValues ? defaultValues : {},
  });

  const onSubmit = async (args: z.infer<typeof formSchema>) => {
    const { title, description, status, dueDate } = args;
    // create new task

    if (type === "create") {
      try {
        const createdBy = auth.currentUser?.uid;
        await addDoc(collection(db, TASK_COLLECTION), {
          createdBy,
          title,
          description,
          status,
          dueDate,
        });
      } catch (error) {
        console.log(error);
      } finally {
        form.reset({
          description: "",
          title: "",
          dueDate: undefined,
          status: "",
        });
      }
    } else {
      try {
        await updateDoc(doc(db, TASK_COLLECTION, taskId as string), {
          description,
          title,
          dueDate,
          status,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-4">
          {/* Title input */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    className="w-full md:min-w-[400px]"
                    placeholder="e.g Complete Project Proposal for Client Meeting"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description text area */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    className="w-full md:min-w-[400px]"
                    placeholder="Prepare project proposal for client meeting. Outline scope, objectives, and timeline with a budget estimate. Ensure clarity and professionalism."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status select */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select task status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="todo">To do</SelectItem>
                    <SelectItem value="progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="secondary"
            className="w-full md:min-w-[400px]"
          >
            {type === "create" ? "Create task" : "Update task"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
