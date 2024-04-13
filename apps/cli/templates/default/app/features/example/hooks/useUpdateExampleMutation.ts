import { useMutation } from "@tanstack/react-query"

import { queryClient } from "@/app/lib/react-query"
import NextApiService from "@/app/services/NextApi.service"

import { Example } from "../types"

export const useUpdateExampleMutation = (
  successCallback?: (updatedExample: Example) => void,
) => {
  return useMutation({
    onSuccess: (_, updatedExample) => {
      queryClient.setQueryData(["examples"], (oldData: Example[]) =>
        oldData
          ? oldData.map((example) =>
              example.id === updatedExample.id ? updatedExample : example,
            )
          : oldData,
      )

      successCallback && successCallback(updatedExample)
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
    mutationFn: NextApiService.updateExample,
  })
}
