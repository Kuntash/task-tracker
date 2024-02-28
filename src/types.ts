export type Task = {
  id: string;
  description?: string;
  title: string;
  dueDate: Date;
  status?: "progress" | "todo" | "completed";
};
