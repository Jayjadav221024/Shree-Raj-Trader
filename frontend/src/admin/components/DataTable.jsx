import React, { useEffect, useRef, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Eye,
  Loader2,
  Inbox,
} from 'lucide-react';

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  pageIndex = 1,
  pageSize = 25,
  totalRecords = 0,
  onPageChange,
  onPageSizeChange,
  search = '',
  onSearchChange,
  sorting = [],
  onSortingChange,
  onEdit,
  onDelete,
  onView,
  searchPlaceholder = 'Search records…',
}) {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [showColumnDrawer, setShowColumnDrawer] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!showColumnDrawer) return;
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setShowColumnDrawer(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showColumnDrawer]);

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility, sorting },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const hasActions = onEdit || onDelete || onView;
  const colSpan = columns.length + (hasActions ? 1 : 0);

  const firstRow = totalRecords === 0 ? 0 : (pageIndex - 1) * pageSize + 1;
  const lastRow = Math.min(pageIndex * pageSize, totalRecords);

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-adm-line bg-adm-surface shadow-adm-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-adm-line p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-adm-faint" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-adm-line bg-adm-surface-2 py-2 pl-9 pr-3 text-sm text-adm-text placeholder:text-adm-faint focus:border-adm-primary focus:bg-adm-surface focus:outline-none focus:ring-2 focus:ring-adm-primary/25"
          />
        </div>

        <div className="relative flex items-center justify-end gap-2" ref={drawerRef}>
          <button
            onClick={() => setShowColumnDrawer((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border border-adm-line bg-adm-surface px-3 py-2 text-sm font-semibold text-adm-text transition-colors hover:bg-adm-surface-3"
          >
            <SlidersHorizontal className="h-4 w-4 text-adm-muted" />
            <span>Columns</span>
          </button>

          {showColumnDrawer && (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-56 rounded-xl border border-adm-line bg-adm-surface p-2 shadow-adm-lg animate-fadeIn">
              <h4 className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-adm-faint">
                Visible columns
              </h4>
              <div className="admin-scroll max-h-60 space-y-0.5 overflow-y-auto">
                {table.getAllLeafColumns().map((column) => {
                  if (column.id === 'srNo' || column.id === 'actions') return null;
                  return (
                    <label
                      key={column.id}
                      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium text-adm-text transition-colors hover:bg-adm-surface-3"
                    >
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        className="h-4 w-4 cursor-pointer rounded border-adm-line-strong accent-adm-primary"
                      />
                      <span className="truncate capitalize">{column.id}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="admin-scroll overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-adm-line bg-adm-surface-2">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      className={`whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-adm-muted select-none ${
                        canSort ? 'cursor-pointer transition-colors hover:text-adm-text' : ''
                      }`}
                      style={{ width: header.getSize() }}
                    >
                      <div className="flex items-center gap-1.5">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort &&
                          (isSorted === 'asc' ? (
                            <ChevronUp className="h-3.5 w-3.5 text-adm-primary" />
                          ) : isSorted === 'desc' ? (
                            <ChevronDown className="h-3.5 w-3.5 text-adm-primary" />
                          ) : (
                            <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                          ))}
                      </div>
                    </th>
                  );
                })}
                {hasActions && (
                  <th className="w-32 whitespace-nowrap px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-adm-muted">
                    Actions
                  </th>
                )}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-adm-line-soft">
            {isLoading ? (
              <tr>
                <td colSpan={colSpan} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-7 w-7 animate-spin text-adm-primary" />
                    <span className="text-sm font-medium text-adm-muted">Loading records…</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2.5 text-adm-faint">
                    <Inbox className="h-10 w-10 stroke-[1.25]" />
                    <span className="text-sm font-medium">No records found</span>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-adm-surface-2">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-3.5 text-sm text-adm-muted">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onView && (
                          <button
                            onClick={() => onView(row.original)}
                            className="rounded-lg p-2 text-adm-faint transition-colors hover:bg-adm-primary-soft hover:text-adm-primary"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row.original)}
                            className="rounded-lg p-2 text-adm-faint transition-colors hover:bg-adm-accent-soft hover:text-adm-accent"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row.original)}
                            className="rounded-lg p-2 text-adm-faint transition-colors hover:bg-adm-danger-soft hover:text-adm-danger"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-adm-line bg-adm-surface-2 px-5 py-3.5 sm:flex-row">
        <div className="flex items-center gap-4 text-sm text-adm-muted">
          <label className="flex items-center gap-1.5">
            <span>Rows</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
              className="cursor-pointer rounded-md border border-adm-line bg-adm-surface px-2 py-1 text-sm font-medium text-adm-text focus:border-adm-primary focus:outline-none focus:ring-2 focus:ring-adm-primary/25"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <span className="hidden sm:inline">
            {firstRow}–{lastRow} of {totalRecords}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-adm-muted">
            Page {pageIndex} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange && onPageChange(pageIndex - 1)}
              disabled={pageIndex <= 1 || isLoading}
              aria-label="Previous page"
              className="rounded-lg border border-adm-line bg-adm-surface p-1.5 text-adm-text transition-colors hover:bg-adm-surface-3 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPageChange && onPageChange(pageIndex + 1)}
              disabled={pageIndex >= totalPages || isLoading}
              aria-label="Next page"
              className="rounded-lg border border-adm-line bg-adm-surface p-1.5 text-adm-text transition-colors hover:bg-adm-surface-3 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
