import { useMutation } from "@tanstack/react-query"

import { queryClient } from "@/app/lib/react-query"
import NextApiService from "@/app/services/NextApi.service"

import { Example } from "../types"

export const useDuplicateExampleMutation = (
  successCallback?: (duplicatedExample: Example) => void,
) => {
  return useMutation({
    onSuccess: (duplicatedExample) => {
      queryClient.setQueryData(["examples"], (oldData: Example[]) =>
        oldData ? [...oldData, duplicatedExample] : [duplicatedExample],
      )

      successCallback && successCallback(duplicatedExample)
    },
    onMutate: () => {
      const previousExamples = queryClient.getQueryData<Example[]>(["examples"])

      return { previousExamples }
    },
    onError: (_, __, context: any) => {
      if (context?.previousExamples) {
        queryClient.setQueryData(["examples"], context.previousExamples)
      }
    },
    mutationFn: NextApiService.duplicateExample,
  })
}
