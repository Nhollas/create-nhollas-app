export interface IClient {
  fetch: (url: string, options?: RequestInit) => Promise<Response>
}

type FetchWrapperArgs = {
  baseUrl: string
  defaultConfig?: RequestInit
}

export function fetchWrapper({ baseUrl, defaultConfig }: FetchWrapperArgs) {
  return (url: string, config?: RequestInit) => {
    const mergedConfig = { ...defaultConfig, ...config }

    if (defaultConfig?.headers && config?.headers) {
      mergedConfig.headers = { ...defaultConfig.headers, ...config.headers }
    }

    return fetch(baseUrl + url, mergedConfig)
  }
}
