import { RootLayout } from "@/shared/components/layout/root-layout"
import { Card, CardContent } from "@/shared/components/ui/card"

export default function DashboardPage() {
  return (
    <RootLayout title="Welcome Page">
        <Card className="rounded-2xl shadow-md border border-gray-200 bg-white">
            <CardContent>
               Dashboard
            </CardContent>
        </Card>

    </RootLayout>
  )
}
