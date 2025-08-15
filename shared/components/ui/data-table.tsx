/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { useState } from "react";
import { useDebouncedCallback } from 'use-debounce';

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu";
import { Button } from "./button";
import { ChevronDown, Loader } from "lucide-react";
import { Input } from "./input";

import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { capitalizeFirst } from "@/shared/lib/utils";
import { PaginationTable } from "./pagination-table";


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onPaginationChange?: any;
  pageCount?: number;
  pagination?: any;
  onSortingChange?: any;
  sorting?: any;
  filter?: (value: any) => void;
  totalData?: number;
  totalFilteredData?: number;
  onClickAdd?: () => void;
  nameAddButton?: string;
  isExportPDF?: boolean;
  isExportExcel?: boolean;
  defaultHiddenColumns?: string[];
}

// type ColumnSort = {
//     id: string;
//     desc: boolean;
// }

export function DataTable<TData, TValue>({
    columns,
    data,
    isLoading,
    onPaginationChange,
    pageCount,
    pagination,
    onSortingChange,
    sorting,
    filter,
    totalData,
    totalFilteredData,
    onClickAdd,
    nameAddButton,
    isExportPDF,
    isExportExcel,
    defaultHiddenColumns
    
}: DataTableProps<TData, TValue>) {

    // const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
        const hiddenColumns = defaultHiddenColumns || [];
        const visibility: VisibilityState = {};
        hiddenColumns.forEach((key) => {
          visibility[key] = false;
        });
        return visibility;
    });

    const debounced = useDebouncedCallback(
        // function
        (value) => {
            if (filter) {
                filter(value);
            }
        },
        // delay in ms
        1000,
    );
    // console.log(columns)
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        onPaginationChange,
        onSortingChange,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            pagination,
            sorting,
            columnVisibility
        },
        pageCount 
    });
    
    return (
        <div className="w-full">
            <div className="flex justify-between items-center gap-5 py-2 flex-wrap">
                <div className="flex justify-center items-baseline gap-x-2 p-1">
                    <p className="text-sm"> Show</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                {table.options.state.pagination?.pageSize}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-[2rem]" align="center">
                            {[10, 20, 30, 40, 50].map((size) => (
                                <DropdownMenuCheckboxItem
                                    key={size}
                                    className="capitalize"
                                    checked={
                                        table.options.state.pagination
                                            ?.pageSize === size
                                    }
                                    onCheckedChange={() => {
                                        table.setPageSize(size);
                                    }}
                                >
                                    {size}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <p className="text-sm"> Entries </p>
                </div>
                <div className="flex gap-5 min-w-[200px] ">
                    {nameAddButton && (
                        <Button 
                            variant="outlineDefault"
                            className="pr-8 pl-8"
                            onClick={onClickAdd}
                        >
                            {nameAddButton}
                        </Button>
                    )}
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto ">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        // column.getCanHide() &&
                                        column.id !== 'actions' &&
                                        column.id !== 'id'
                                )
                                .map((column) => {
                                    const label = (column.columnDef.meta as { label?: string })?.label || column.id;
                                    const columnName = capitalizeFirst(label);
                                    
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            checked={column.getIsVisible()}
                                            disabled={!column.getCanHide()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                             {columnName}
                                            {/*{column.getIsVisible() ? " (d)" : ""} */}
                                            {/* {(defaultHiddenColumns || []).includes(column.id)
                                                ? columnName
                                                : `${columnName} (d)`} */}
                                            
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Input
                        placeholder={`Search...`}
                        onChange={(e: any) => debounced(e.target.value)}
                    />
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            className="px-2"
                                            key={header.id}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center relative"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader className="h-5 w-5  animate-spin text-black" />
                                            <p className="animate-pulse">
                                                Fetching data...
                                            </p>
                                        </div>
                                    ) : (
                                        'No data available'
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    
                </Table>
            </div>
            <div className="flex justify-between mt-4 mb-2 flex-wrap md:flex-nowrap ">
                <div className="font-medium">
                    showing {totalFilteredData} of {totalData} entries
                </div>
                <div className="flex gap-2 flex-wrap  md:flex-nowrap">
                    {pagination && <PaginationTable tableLib={table} />}
                    {/* {isExportPDF && (
                        <Button 
                            variant="outlineDefault" 
                            // onClick={handleExportPDF}
                        >
                            <FaFilePdf className="mr-2" />
                            Export PDF
                        </Button>
                    )}
                    {isExportExcel && (
                        <Button 
                            variant="outlineDefault" 
                            // onClick={handleExportExcel}
                        >
                            <FaFileExcel className="mr-2" />
                            Export Excel
                        </Button>
                    )} */}
                </div>
            </div>

            <div className="flex items-center justify-center md:justify-end py-4 min-w-[200px] md:w-auto overflow-x-auto">
                {/* {pagination && <PaginationTable tableLib={table} />} */}
                {isExportPDF && (
                    <Button 
                        variant="outlineDefault" 
                        // onClick={handleExportPDF}
                    >
                        <FaFilePdf className="mr-2" />
                        Export PDF
                    </Button>
                )}
                {isExportExcel && (
                    <Button 
                        variant="outlineDefault" 
                        // onClick={handleExportExcel}
                    >
                        <FaFileExcel className="mr-2" />
                        Export Excel
                    </Button>
                )} 
            </div>
        </div>
    )
}
