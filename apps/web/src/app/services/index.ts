import { AxiosInstance } from "axios"

export interface IClient {
  instance: AxiosInstance
  createUrl: (path: string) => string
}

export interface IService {
  createUrl(path: string): string
}
