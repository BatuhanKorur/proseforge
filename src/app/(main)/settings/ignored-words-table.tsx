'use client'

import type {
  ColumnFiltersState,
} from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/ui/table-pagination'
import { useUserStore } from '@/stores/user.store'

export function IgnoredWordsTable() {
  const { ignoredWords, removeIgnoredWord } = useUserStore()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  function handleRemove(word: string) {
    removeIgnoredWord(word)
  }

  function handleRemoveAll() {
    console.log('todo: handle remove all')
  }

  const data = useMemo(() =>
    ignoredWords.map(word => ({
      word: word.trim().toLowerCase(),
    })), [ignoredWords])

  const columns = useMemo(() => [
    {
      accessorKey: 'word',
      header: 'Word',
      cell: ({ row }: { row: { original: { word: string } } }) => (
        <div className="font-medium text-[15px] pl-1">{row.original.word}</div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: { original: { word: string } } }) => {
        return (
          <div className="flex items-center justify-end">
            <Button size="sm" variant="ghost" onClick={() => handleRemove(row.original.word)}>
              <span>Remove</span>
            </Button>
          </div>
        )
      },
    },
  ], [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Filter ignored words..."
          value={(table.getColumn('word')?.getFilterValue() as string) ?? ''}
          onChange={event => table.getColumn('word')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div>
          <Button size="sm" variant="outline" onClick={handleRemoveAll}>
            Clear All Filters
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length
              ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )
              : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
