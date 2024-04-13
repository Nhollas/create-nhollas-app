import { forwardRef } from "react"
import { UseFormReturn } from "react-hook-form"

import {
  CardHeader,
  CardContent,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  AutosizeTextarea,
} from "@/app/components/ui"

import { EditExampleForm } from "../hooks/useEditExampleForm"

export const EditExample = forwardRef<
  HTMLDivElement,
  {
    form: UseFormReturn<EditExampleForm>
  }
>(({ form }, ref) => {
  return (
    <div ref={ref} className="flex h-full flex-col">
      <CardHeader className="p-4 pb-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AutosizeTextarea
                  placeholder="Title"
                  className="border-none p-2 text-2xl font-semibold leading-none tracking-tight outline outline-input"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AutosizeTextarea
                  placeholder="Description"
                  className="border-none p-2 text-muted-foreground outline outline-input w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </div>
  )
})

EditExample.displayName = "EditExample"
