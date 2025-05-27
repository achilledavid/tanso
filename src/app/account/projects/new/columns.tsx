"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ListBlobResultBlob } from "@vercel/blob"

export const columns: ColumnDef<ListBlobResultBlob>[] = [
  {
    id: "select",
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
