'use client'

import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/dashboard/feedback/data-table-view-options'

import { DataTableFacetedFilter } from '@/components/dashboard/feedback/data-table-faceted-filter'
import { reviewStatuses, ratings } from '@/components/dashboard/feedback/data/data'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  type: 'reviews' | 'experiences'
}

export function DataTableToolbar<TData>({ table, type }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder={`Filter ${type}...`}
          value={(table.getColumn('comment')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('comment')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {type === 'reviews' && table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={reviewStatuses}
          />
        )}
        {table.getColumn('rating') && (
          <DataTableFacetedFilter
            column={table.getColumn('rating')}
            title="Rating"
            options={ratings}
          />
        )}
        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={() => table.resetColumnFilters()}>
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
