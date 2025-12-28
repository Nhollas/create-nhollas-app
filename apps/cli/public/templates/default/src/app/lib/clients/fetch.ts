export interface IClient {
  fetch: (url: string, options?: RequestInit) => Promise<Response>
}

type FetchWrapperArgs = {
  baseUrl: string
  defaultConfig?: RequestInit
}

export function fetchWrapper({ baseUrl, defaultConfig }: FetchWrapperArgs) {
  return (url: string, config?: RequestInit) => {
    return fetch(baseUrl + url, Object.assign(defaultConfig || {}, config))
  }
}
