"use client"
import { motion } from "framer-motion"
import { useState } from "react"

import { AnimatePresenceWrapper } from "@/app/components"
import { CardFooter, Form } from "@/app/components/ui"

import {
  useUpdateExampleMutation,
  EditExampleForm,
  useEditExampleForm,
} from "../hooks"
import { Example } from "../types"

import { AnimatedEditExample } from "./AnimatedEditExample"
import { DeleteExampleButton } from "./DeleteExampleButton"
import { DuplicateExampleButton } from "./DuplicateExampleButton"
import { UpdateExampleButton } from "./UpdateExampleButton/UpdateExampleButton"

export const ManageExampleContainer = ({
  children,
  example,
}: {
  children: React.ReactNode
  example: Example
}) => {
  const form = useEditExampleForm(example)
  const {
    formState: { isDirty, isSubmitting },
  } = form

  const [editOpen, setEditOpen] = useState(false)

  const closeForm = () => setEditOpen(false)
  const openForm = () => setEditOpen(true)

  const { mutateAsync } = useUpdateExampleMutation(() => closeForm())

  const saveDisabled = !isDirty || isSubmitting

  const handleSubmit = async (values: EditExampleForm) => {
    await mutateAsync(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex grow flex-col"
      >
        <AnimatePresenceWrapper mode="popLayout">
          {editOpen ? (
            <AnimatedEditExample
              form={form}
              layout
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{
                type: "spring",
                duration: 0.25,
              }}
            />
          ) : (
            <motion.div
              layout
              className="flex h-full flex-col"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{
                type: "spring",
                duration: 0.25,
              }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresenceWrapper>
        <CardFooter className="flex flex-row gap-x-2">
          <DeleteExampleButton exampleId={example.id} />
          <UpdateExampleButton
            saveDisabled={saveDisabled}
            editOpen={editOpen}
            isSubmitting={isSubmitting}
            openForm={openForm}
            closeForm={closeForm}
          />
          <DuplicateExampleButton example={example} />
        </CardFooter>
      </form>
    </Form>
  )
}
