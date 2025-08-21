'use client'

import { ColumnDef } from "@tanstack/react-table"
import { TCategory } from "../interfaces/category"
import { Button } from "@/shared/components/ui/button"
import { ArrowUp } from "lucide-react"
import { CellAction } from "@/shared/components/ui/cell-action"
import FormCategory from "./form-category"
import { capitalizeFirst } from "@/shared/lib/utils"

export const columns: ColumnDef<TCategory>[] = [
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
        accessorKey: "type",
        header:({column}) => {
            return(
                <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
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
                <div >
                    {capitalizeFirst(row.original.type)}
                </div>
            )
        },
    },
    {
        accessorKey: "budgeting.name",
        header: "Budgeting",
        // header:({column}) => {
        //     return(
        //         <Button
        //         variant={"ghost"}
        //         size={"sm"}
        //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        //         >
        //         Allocation
        //         <ArrowUp 
        //             className={`ml-2 h-4 w-full ${
        //             column.getIsSorted() === "asc" ? "" : "rotate-180"
        //             } `}
        //         />

        //         </Button>
        //     )
        // },
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
        id: "actions",
        header:"Action",
        cell:({row}) => {
        return <CellAction 
                title="Category"
                row={row.original}
                formComponent={FormCategory}
                actionUpdate={true}
                dialogSizeUpdate="lg"
                params={row.original.name}
                deleteActionType="category"
            

                />
        },


    }
]