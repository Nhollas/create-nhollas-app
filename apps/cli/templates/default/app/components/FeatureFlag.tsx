import { getVariation } from "../lib/launchdarkly"

export async function FeatureFlag<TValue>({
  flag,
  defaultValue,
  render,
}: {
  flag: string
  defaultValue: TValue
  render: (value: TValue) => JSX.Element
}) {
  const flagValue = await getVariation(flag, defaultValue)

  return render(flagValue)
}
