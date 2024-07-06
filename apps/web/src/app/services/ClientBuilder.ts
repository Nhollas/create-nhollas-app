import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

interface IClientBuilder {
  build: (defaultConfig?: AxiosRequestConfig) => AxiosInstance
  baseUrl: (base: string) => (path: string) => string
}

const ClientBuilder = (): IClientBuilder => ({
  build(defaultConfig?: AxiosRequestConfig) {
    return axios.create(defaultConfig)
  },
  baseUrl(base: string) {
    return (path: string) => `${base}${path}`
  },
})

export default ClientBuilder()
