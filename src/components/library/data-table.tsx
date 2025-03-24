"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  CellContext,
  RowSelectionState,
  OnChangeFn,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button/button"
import { useMemo, memo } from "react"
import { Upload } from "lucide-react"
import { SoundPlayer } from "./sound-player"
import { ListBlobResultBlob } from "@vercel/blob"

const PAGE_SIZE = 5;

interface DataTableProps<TData extends ListBlobResultBlob> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  onSelect?: (file: ListBlobResultBlob) => void
  rowSelection: RowSelectionState
  setRowSelection: OnChangeFn<RowSelectionState>
}

const ActionCell = memo(({ file, onSelect }: { file: ListBlobResultBlob, onSelect?: (file: ListBlobResultBlob) => void }) => (
  <div className="flex w-full justify-end gap-2">
    <SoundPlayer file={file} />
    {onSelect && (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onSelect(file)}
      >
        <Upload />
      </Button>
    )}
  </div>
));
ActionCell.displayName = 'ActionCell';

export function DataTable<TData extends ListBlobResultBlob>({
  columns,
  data,
  onSelect,
  rowSelection,
  setRowSelection
}: DataTableProps<TData>) {
  const enhancedColumns = useMemo(() =>
    columns.map(column => ({
      ...column,
      cell: column.id === 'actions' ?
        (props: CellContext<TData, unknown>) => (
          <ActionCell file={props.row.original} onSelect={onSelect} />
        ) : (
          column.cell
        )
    })), [columns, onSelect]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: PAGE_SIZE,
      },
    },
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
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
                  no results.
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
  );
}
