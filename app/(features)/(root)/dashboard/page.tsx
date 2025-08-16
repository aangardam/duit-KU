"use client"

import { RootLayout } from "@/shared/components/layout/root-layout"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Progress } from "@/shared/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard
} from "lucide-react"

import useDashboard from "./hooks/use-dashboard"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { formatCurrency, formatRupiah } from "@/shared/lib/utils"

export default function DashboardPage() {

  const {
    totalBalance,
    isPendingTotalBalance,
    dataWallets,
    isPendingWallets,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    monthNames,
    years,
    totalGaji,
    allocation,
  } = useDashboard();
  // console.log(dataWallets)
  return (
    <RootLayout title="Welcome Page">
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Dashboard Keuangan</h1>
              <p className="text-muted-foreground">Kelola pengeluaran dan anggaran Anda dengan mudah</p>
            </div>

            {/* Total Balance Summary */}
            <Card className="bg-gradient-to-l from-cyan-700 to-indigo-600 text-primary-foreground">
              <CardContent className="p-6">
                {isPendingTotalBalance ? (
                  <div className="flex items-center space-x-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold">Total Saldo</p>
                        <p className="text-2xl font-bold">Rp {totalBalance ? formatRupiah(`${totalBalance}`) : 0}</p>
                      </div>
                      <Wallet className="h-8 w-8 text-primary-foreground/80" />
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Wallet Cards */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Dompet Saya</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isPendingWallets ? (
                    <div className="flex items-center space-x-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                ) : (
                    dataWallets?.map((wallet) => {
                      return (
                        <Card key={wallet.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-card-foreground">{wallet.name}</CardTitle>
                            {wallet.type === 'Bank' ? (
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                            ): (
                                <Wallet className="h-4 w-4 text-muted-foreground" />
                            )}
                            {/* <Wallet className="h-4 w-4 text-muted-foreground" /> */}
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="text-2xl font-bold text-card-foreground">Rp {formatRupiah(`${wallet.balance}`)}</div>
                              <Badge variant="gradientBlue" className="text-xs">
                                {wallet.type}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                )}
              </div>
            </div>

            {/* Budget Comparison */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">Perbandingan Anggaran vs Realisasi</h2>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={selectedMonth.toString()}
                    onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {monthNames.map((month, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedYear.toString()}
                    onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Anggaran {monthNames[selectedMonth]} {selectedYear} ( Rp {totalGaji ? formatRupiah(`${totalGaji}`) : 0} )
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {allocation?.map((item, index) => {
                      const difference = item.total_expense - item.amount
                      const isOverBudget = difference > 0
                      const usagePercentage = (item.total_expense / item.amount) * 100

                      return (
                        <div key={index} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h3 className="font-medium text-card-foreground">{item.budgeting?.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.percentage}% dari total anggaran</p>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="flex items-center gap-2">
                                {isOverBudget ? (
                                  <TrendingUp className="h-4 w-4 text-destructive" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-foreground" />
                                )}
                                <span
                                  className={`text-sm font-medium ${isOverBudget ? "text-destructive" : "text-foreground"}`}
                                >
                                  {isOverBudget ? "+" : ""}
                                  Rp {formatRupiah(`${Math.abs(difference)}`)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Rencana</p>
                              <p className="font-medium">Rp {formatRupiah(`${item.amount}`)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Realisasi</p>
                              <p className="font-medium">Rp {formatRupiah(`${item.total_expense}`)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Sisa/Selisih</p>
                              <p className={`font-medium ${isOverBudget ? "text-destructive" : "text-foreground"}`}>
                                Rp {formatRupiah(`${item.amount - item.total_expense}`)}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Penggunaan: {usagePercentage.toFixed(1)}%</span>
                              <span>
                                Rp {formatRupiah(`${item.total_expense}`)} / {formatRupiah(`${item.amount}`)}
                              </span>
                            </div>
                            <Progress value={Math.min(usagePercentage, 100)} className="h-2" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    </RootLayout>
  )
}
