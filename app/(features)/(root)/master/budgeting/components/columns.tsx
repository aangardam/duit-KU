'use client'

import { ColumnDef } from "@tanstack/react-table"
import { TBudgeting } from "../interfaces/budgeting"
import { Button } from "@/shared/components/ui/button"
import { ArrowUp } from "lucide-react"
import { CellAction } from "@/shared/components/ui/cell-action"
import FormBudgeting from "./form-budgeting"

export const columns: ColumnDef<TBudgeting>[] = [
    {
        id: "no",
        header: "No",
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div>{pageIndex * pageSize + row.index + 1}</div>;
        },
    },
    {
        accessorKey: "name",
        header:({column}) => {
            return(
                <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                Name
                <ArrowUp 
                    className={`ml-2 h-4 w-full ${
                    column.getIsSorted() === "asc" ? "" : "rotate-180"
                    } `}
                />

                </Button>
            )
        },
    },
    {
        accessorKey: "percentage",
        header:({column}) => {
            return(
                <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                Percentage
                <ArrowUp 
                    className={`ml-2 h-4 w-full ${
                    column.getIsSorted() === "asc" ? "" : "rotate-180"
                    } `}
                />

                </Button>
            )
        },
        cell: ({ row }) => { 
            return(
                <span> {row.original.percentage}% </span>
            )
        }
    },
    
    {
        id: "actions",
        header:"Action",
        cell:({row}) => {
        return <CellAction 
                title="Budgeting"
                row={row.original}
                formComponent={FormBudgeting}
                actionUpdate={true}
                dialogSizeUpdate="lg"
                params={row.original.name}
                deleteActionType="budgeting"
            

                />
        },


    }
]