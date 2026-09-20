import React, { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  align?: "left" | "center" | "right";
  width?: string;
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "No records found in active telemetry.",
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aRecord = a as Record<string, unknown>;
      const bRecord = b as Record<string, unknown>;
      const aVal = aRecord[sortKey];
      const bVal = bRecord[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortKey, sortOrder]);

  return (
    <div className={twMerge(clsx("w-full overflow-x-auto rounded border border-white/8 bg-[#090D17]/80", className))}>
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-white/10 bg-[#0B0F1C]/90 text-[#94A3B8] font-mono-tech tracking-wider uppercase">
            {columns.map((col) => {
              const keyStr = String(col.key);
              const isSorted = sortKey === keyStr;
              return (
                <th
                  key={keyStr}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(keyStr)}
                  className={clsx(
                    "px-4 py-3 font-semibold select-none whitespace-nowrap",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.sortable && "cursor-pointer hover:text-white transition-colors"
                  )}
                >
                  <div
                    className={clsx(
                      "inline-flex items-center gap-1.5",
                      col.align === "right" && "justify-end w-full",
                      col.align === "center" && "justify-center w-full"
                    )}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-[#64748B]">
                        {isSorted ? (
                          sortOrder === "asc" ? (
                            <ChevronUp size={13} className="text-[#D4AF37]" />
                          ) : (
                            <ChevronDown size={13} className="text-[#D4AF37]" />
                          )
                        ) : (
                          <ChevronsUpDown size={12} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-mono-tech">
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-[#64748B] italic"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  "hover:bg-[#12192B]/80 transition-colors group",
                  onRowClick && "cursor-pointer",
                  index % 2 === 1 ? "bg-white/[0.015]" : "bg-transparent"
                )}
              >
                {columns.map((col) => {
                  const keyStr = String(col.key);
                  return (
                    <td
                      key={keyStr}
                      className={clsx(
                        "px-4 py-2.5 text-[#CBD5E1] whitespace-nowrap",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center"
                      )}
                    >
                      {col.render
                        ? col.render(row, index)
                        : ((row as Record<string, unknown>)[col.key as string] as React.ReactNode)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
