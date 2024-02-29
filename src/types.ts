export type Task = {
  id: string;
  description?: string;
  title: string;
  dueDate: Date;
  status?: "progress" | "todo" | "completed";
};

export type Column = {
  id: string;
  label: string;
};
export type DataTableProps = {
  columns: Column[];
  data: any[];
};
