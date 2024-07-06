import { Fragment, forwardRef } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/app/components/ui"
import { cn } from "@/app/lib/utils"

import { Example } from "../types"

export const ExampleCard = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    example: Example
  }
>(({ className, children, example, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn("flex flex-col bg-secondary", className)}
    id={example.id}
    {...props}
  >
    {children}
  </Card>
))

ExampleCard.displayName = "ExampleCardContainer"

export const ExampleCardBody = ({ example }: { example: Example }) => (
  <Fragment>
    <CardHeader>
      <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
        {example.title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-secondary-foreground">
        {example.description}
      </CardDescription>
    </CardContent>
  </Fragment>
)

export const ExampleCardSkeleton = () => {
  return <Skeleton className={cn("aspect-square bg-accent w-full h-full")} />
}
