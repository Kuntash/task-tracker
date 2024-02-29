import { cn } from "@/lib/utils";
import { DataTableProps } from "@/types";
import Link from "next/link";
import React from "react";

export const DataTable = (props: DataTableProps) => {
  const { columns, data } = props;

  return (
    <div className="rounded-lg border border-slate-900/10">
      <div className="relative w-full overflow-auto">
        <table className="md:w-full w-[700px]">
          <thead>
            <tr className="border-b border-b-slate-900/10">
              {columns?.map((column) => (
                <th key={column.id} className="h-10 text-center">
                  {column?.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data?.map((cell) => (
              <tr className="border-b border-b-slate-900/10 last:border-b-0">
                {columns?.map((column) => (
                  <td key={column.id} className="h-10 text-center">
                    <Link href={`/dashboard/update-task/${cell.id}`}>
                      <div
                        className={cn(
                          "text-sm",
                          column.id === "status" &&
                            "bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-1 rounded-lg text-sm font-medium",
                          column.id === "renderId" && "text-slate-900/50",
                          column.id === "dueDate" && "text-slate-900/50"
                        )}
                      >
                        {column?.id === "id" && "#"}
                        {cell?.[column?.id]}
                      </div>
                    </Link>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
