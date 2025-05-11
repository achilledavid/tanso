"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ListBlobResultBlob } from "@vercel/blob"
import { Checkbox } from "../ui/checkbox"

export const columns: ColumnDef<ListBlobResultBlob>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "pathname",
    header: "Name",
    cell: ({ row }) => {
      return <span>{row.original.pathname}</span>
    }
  },
  {
    id: "actions"
  },
]
