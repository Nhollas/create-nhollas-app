"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { exampleSchema } from "../schemas"
import { Example } from "../types"

export type EditExampleForm = z.infer<typeof exampleSchema>

export const useEditExampleForm = (example: Example) =>
  useForm<EditExampleForm>({
    resolver: zodResolver(exampleSchema),
    defaultValues: example,
  })
