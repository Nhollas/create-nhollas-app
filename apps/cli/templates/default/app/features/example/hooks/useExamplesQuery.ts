import { useQuery } from "@tanstack/react-query"

import NextApiService from "@/app/services/NextApi.service"

import { Example } from "../types"

export function useExamplesQuery(initExamples: Example[] = []) {
  return useQuery({
    queryKey: ["examples"],
    queryFn: NextApiService.getExamples,
    initialData: initExamples,
    staleTime: 1000 * 60 * 5,
  })
}
