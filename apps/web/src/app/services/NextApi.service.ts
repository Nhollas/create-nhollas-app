import { IService } from "."

// const NextApiClient: IClient = {
//   fetch: fetchWrapper({
//     baseUrl: "/api",
//   }),
// }

type INextApiService = IService

const NextApiService = (): INextApiService => ({
  createUrl: (path) => {
    return `/api${path}`
  },
})

export default NextApiService()
