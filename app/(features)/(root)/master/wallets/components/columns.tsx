'use client'

import { ColumnDef } from "@tanstack/react-table"
import { TWallet } from "../interfaces/wallets"
import { Button } from "@/shared/components/ui/button"
import { ArrowUp } from "lucide-react"
import { formatRupiah } from "@/shared/lib/utils"
import FormWallet from "./form-wallets"
import { CellAction } from "@/shared/components/ui/cell-action"

export const columns: ColumnDef<TWallet>[] = [
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
    },
    {
        accessorKey: "balance",
        header:({column}) => {
            return(
                <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                    Balance
                    <ArrowUp 
                        className={`ml-2 h-4 w-full ${
                        column.getIsSorted() === "asc" ? "" : "rotate-180"
                        } `}
                    />

                </Button>
            )
        },
        cell:({row}) =>{
            return(
                <div >
                    Rp. {formatRupiah(`${row.original.balance}`)}
                </div>
            )
        }
    },
    {
        id: "actions",
        header:"Action",
        cell:({row}) => {
        return <CellAction 
                title="Wallets"
                row={row.original}
                formComponent={FormWallet}
                actionUpdate={true}
                dialogSizeUpdate="lg"
                params={row.original.name}
                deleteActionType="wallet"
            

                />
        },


    }
]