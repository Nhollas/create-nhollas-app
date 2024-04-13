import { RotateCw, Save } from "lucide-react"
import { forwardRef, ForwardedRef } from "react"

import { AnimatedButton } from "@/app/components/ui"

const SaveButton = forwardRef(
  (
    {
      saveDisabled,
      isSubmitting,
    }: { saveDisabled: boolean; isSubmitting: boolean },
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <AnimatedButton
        ref={ref}
        layout
        initial={{ opacity: 0, x: -50, scale: 0.5 }}
        animate={{ opacity: saveDisabled ? 0.5 : 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -50, scale: 0.5 }}
        transition={{
          type: "spring",
          duration: 0.25,
        }}
        variant="outline"
        type="submit"
        className="z-10 aspect-square h-10"
        disabled={saveDisabled}
      >
        {isSubmitting ? (
          <RotateCw className="h-5 w-5 flex-shrink-0 animate-spin" />
        ) : (
          <Save className="h-5 w-5 flex-shrink-0" />
        )}
        <span className="sr-only">Save</span>
      </AnimatedButton>
    )
  },
)

SaveButton.displayName = "SaveButton"

export default SaveButton
