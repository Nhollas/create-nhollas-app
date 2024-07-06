import { Fragment } from "react"

import { AnimatePresenceWrapper } from "@/app/components"

import EditButton from "./EditButton"
import SaveButton from "./SaveButton"

type UpdateExampleButtonProps = {
  saveDisabled: boolean
  isSubmitting: boolean
  editOpen: boolean
  openForm: () => void
  closeForm: () => void
}

export const UpdateExampleButton = ({
  saveDisabled,
  isSubmitting,
  editOpen,
  openForm,
  closeForm,
}: UpdateExampleButtonProps) => {
  return (
    <Fragment>
      <EditButton
        openForm={openForm}
        closeForm={closeForm}
        editOpen={editOpen}
      />
      <AnimatePresenceWrapper mode="popLayout">
        {editOpen && (
          <SaveButton saveDisabled={saveDisabled} isSubmitting={isSubmitting} />
        )}
      </AnimatePresenceWrapper>
    </Fragment>
  )
}
