"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ListBlobResultBlob } from "@vercel/blob"
import { Button } from "../ui/button"
import { Upload, Volume2 } from "lucide-react"
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
      <div>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "pathname",
    header: "name",
  },
  {
    id: "actions",
    cell: () => {
      return (
        <div className="flex w-full justify-end gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Volume2 />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Upload />
          </Button>
        </div>
      )
    },
  },
]
