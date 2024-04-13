import { Eraser, Pencil } from "lucide-react"

import { AnimatedButton } from "@/app/components/ui"

type EditButtonProps = {
  openForm: () => void
  closeForm: () => void
  editOpen: boolean
}
function EditButton({ openForm, closeForm, editOpen }: EditButtonProps) {
  return (
    <AnimatedButton
      layout
      variant="outline"
      className="z-20 aspect-square h-10"
      type="button"
      onClick={() => (editOpen ? closeForm() : openForm())}
    >
      {editOpen ? (
        <>
          <Eraser className="h-5 w-5 flex-shrink-0" />
          <span className="sr-only">Cancel Edit</span>
        </>
      ) : (
        <>
          <Pencil className="h-5 w-5 flex-shrink-0" />
          <span className="sr-only">Update Example</span>
        </>
      )}
    </AnimatedButton>
  )
}

export default EditButton
