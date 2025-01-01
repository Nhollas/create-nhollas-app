import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"

export function HomeCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Nhollas App</CardTitle>
        <CardDescription>
          Start building your project without faff.
        </CardDescription>
        <CardDescription>{new Date().toDateString()}</CardDescription>
      </CardHeader>
    </Card>
  )
}
