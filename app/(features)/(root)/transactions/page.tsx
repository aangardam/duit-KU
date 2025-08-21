"use client"

import { RootLayout } from "@/shared/components/layout/root-layout"
import { Card, CardContent } from "@/shared/components/ui/card"
import Client from "./components/client"
import FormFilter from "./components/form-filter"
import { useState } from "react"
import { TFilterTransactions } from "./interfaces/transactions"
import { changeDateConnectore, dateNow, startDate } from "@/shared/lib/utils"
import { format } from "date-fns"

export default function TransactionsPage() {
  const [dataFilter, setDataFilter] = useState<TFilterTransactions>({
    startDateTransaction: changeDateConnectore(format(new Date(startDate()), "yyyy-MM-dd")),
    endDateTransaction: changeDateConnectore(format(new Date(dateNow()), "yyyy-MM-dd")),
    categoryId: "",
    type: "",
    walletId: "",
  })
  return (
    <RootLayout title="Welcome Page">
      <Card className="rounded-2xl shadow-md border border-gray-200 bg-white">
        <CardContent className="-mt-5">
          <FormFilter
              setDataFilter={setDataFilter}
          />
        </CardContent>
      </Card>
        <Card className="rounded-2xl shadow-md border border-gray-200 bg-white">
            <CardContent>
              <Client
                dataFilter={dataFilter}
              />
            </CardContent>
        </Card>

    </RootLayout>
  )
}
