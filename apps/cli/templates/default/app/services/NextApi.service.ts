import { Example } from "@/app/features/example"

import ClientBuilder from "./ClientBuilder"

import { IClient, IService } from "."

interface INextApiClient extends IClient {}
const NextApiClient: INextApiClient = {
  instance: ClientBuilder.build({
    baseURL: "/api",
    headers: {
      "Content-Type": "application/json",
    },
  }),
  createUrl: ClientBuilder.baseUrl("/api"),
}

interface INextApiService extends IService {
  getExamples(): Promise<Example[]>
  deleteExample(exampleId: string): Promise<void>
  updateExample(example: Example): Promise<Example>
  duplicateExample(example: Example): Promise<Example>
}

const NextApiService = (): INextApiService => ({
  createUrl(path: string) {
    return NextApiClient.createUrl(path)
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteExample(exampleId: string) {
    try {
      await NextApiClient.instance.delete(`/example`)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async updateExample(example: Example) {
    try {
      const response = await NextApiClient.instance.put(`/example`, example)
      return response.data
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getExamples() {
    try {
      const response = await NextApiClient.instance.get(`/examples`)

      return response.data
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async duplicateExample(example: Example) {
    try {
      const response = await NextApiClient.instance.post(
        `/example/duplicate`,
        example,
      )

      return response.data
    } catch (error) {
      return Promise.reject(error)
    }
  },
})

export default NextApiService()
