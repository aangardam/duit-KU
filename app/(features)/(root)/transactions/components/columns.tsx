'use client'

import { ColumnDef } from "@tanstack/react-table"
import { TTransactions } from "../interfaces/transactions"
import { Button } from "@/shared/components/ui/button"
import { ArrowUp } from "lucide-react"
import { CellAction } from "@/shared/components/ui/cell-action"
import { Badge } from "@/shared/components/ui/badge"
import FormTransaction from "./form-transactions"
import { capitalizeFirst, formatRupiah, getBadgeColor } from "@/shared/lib/utils"

export const columns: ColumnDef<TTransactions>[] = [
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
        accessorKey: "date",
        header:({column}) => {
            return(
                <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                    Date
                    <ArrowUp 
                        className={`ml-2 h-4 w-full ${
                        column.getIsSorted() === "asc" ? "" : "rotate-180"
                        } `}
                    />

                </Button>
            )
        },
        // cell:({row}) =>{
        //     return(
        //         <div >
        //             Rp. {formatRupiah(`${row.original.balance}`)}
        //         </div>
        //     )
        // }
    },
    {
        accessorKey:"category.name",
        header:({column}) => {
            return(
                <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                    Category
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
                    {row.original.category.name}
                </div>
            )
        },
    },
    {
        accessorKey:"wallets.name",
        header:({column}) => {
            return(
                <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                    Wallet
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
                    {row.original.wallets.name}
                </div>
            )
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
            let color = 'Success';
            if (row.original.type === 'expense') {
                color = 'Danger';
            } else if (row.original.type === 'transfer') {
                color = 'Warning';
            }
            return(
                <div >
                    <Badge variant={getBadgeColor(color)}>
                        {capitalizeFirst(row.original.type)}
                        {/* {row.original.type} */}
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "amount",
        header:({column}) => {
            return(
                <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                    Amount
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
                    Rp. {formatRupiah(`${row.original.amount}`)}
                </div>
            )
        },
    },
    {
        accessorKey:"description",
        header:({column}) => {
            return(
                <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                    Description
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
                    {row.original.description}
                </div>
            )
        },
    },
    {
        id: "actions",
        header:"Action",
        cell:({row}) => {
        return <CellAction 
                title="Transactions"
                row={row.original}
                formComponent={FormTransaction}
                actionUpdate={true}
                dialogSizeUpdate="lg"
                actionDelete={false}
                params={row.original.name}
                deleteActionType="transaction"
            

                />
        },


    }
]