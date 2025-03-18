"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  CellContext,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import { useState } from "react"
import { Upload } from "lucide-react"
import { SoundPlayer } from "./sound-player"
import { ListBlobResultBlob } from "@vercel/blob"

interface DataTableProps<TData extends ListBlobResultBlob, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onSelect?: (file: TData) => void
}

export function DataTable<TData extends ListBlobResultBlob, TValue>({
  columns,
  data,
  onSelect,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data,
    columns: columns.map(column => ({
      ...column,
      cell: column.id === 'actions' ?
        (props: CellContext<TData, TValue>) => (
          <div className="flex w-full justify-end gap-2">
            <SoundPlayer file={props.row.original} />
            {onSelect && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onSelect(props.row.original)}
              >
                <Upload />
              </Button>
            )}
          </div>
        ) : (
          column.cell
        )
    })),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          previous
        </Button>
        <Button
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          next
        </Button>
      </div>
    </div>
  )
}
