import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { queryClient } from "@/app/lib/react-query"
import NextApiService from "@/app/services/NextApi.service"

import { Example } from "../types"

export const useDeleteExampleMutation = (successCallback?: () => void) => {
  return useMutation({
    onSuccess: (_, exampleId) => {
      queryClient.setQueryData(["examples"], (oldData: Example[]) =>
        oldData
          ? oldData.filter((example) => example.id !== exampleId)
          : oldData,
      )

      successCallback && successCallback()
    },
    onMutate: () => {
      const previousExamples = queryClient.getQueryData<Example[]>(["examples"])

      return { previousExamples }
    },
    onError: (_, __, context: any) => {
      if (context?.previousExamples) {
        queryClient.setQueryData(["examples"], context.previousExamples)
      }

      toast.error(
        "An error occurred while deleting the example, no changes were made.",
      )
    },
    mutationFn: NextApiService.deleteExample,
  })
}
