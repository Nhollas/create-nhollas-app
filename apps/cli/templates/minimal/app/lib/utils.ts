import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const pause = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export async function renderPromise<T, Args extends any[] = any[]>(
  render: (data: T) => JSX.Element,
  promise: (...args: Args) => Promise<T>,
  ...args: Args
) {
  const data = await promise(...args)

  return render(data)
}
