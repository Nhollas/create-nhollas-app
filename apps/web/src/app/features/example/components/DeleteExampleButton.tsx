"use client"
import { RotateCw, Trash } from "lucide-react"
import { useState } from "react"

import { ErrorBoundaryWrapper } from "@/app/components"
import {
  Button,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
  AnimatedButton,
} from "@/app/components/ui"

import { useDeleteExampleMutation } from "../hooks"

export const DeleteExampleButton = ({ exampleId }: { exampleId: string }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const closeDialog = () => setDialogOpen(false)
  const openDialog = () => setDialogOpen(true)

  const { mutate, isPending } = useDeleteExampleMutation(() => closeDialog())

  return (
    <AlertDialog open={dialogOpen}>
      <AlertDialogTrigger asChild>
        <AnimatedButton
          layout
          variant="outline"
          className="aspect-square h-10"
          onClick={() => openDialog()}
        >
          <Trash className="h-5 w-5 flex-shrink-0" />
          <span className="sr-only">Delete Example</span>
        </AnimatedButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this example?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => closeDialog()}>
            Cancel
          </AlertDialogCancel>
          {isPending ? (
            <AlertDialogAction disabled>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </AlertDialogAction>
          ) : (
            <ErrorBoundaryWrapper fallback={<div>Something went wrong</div>}>
              <Button variant="destructive" onClick={() => mutate(exampleId)}>
                Confirm
              </Button>
            </ErrorBoundaryWrapper>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
