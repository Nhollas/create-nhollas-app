import { HomeCard } from "@/app/components"
import { FeatureFlag } from "@/app/components/FeatureFlag"

export default async function Home() {
  return (
    <section className="w-full space-y-8">
      <HomeCard />
      <FeatureFlag
        flag="exampleFlag"
        defaultValue={12}
        render={(value) =>
          value ? (
            <h1>Feature Flag Is Enabled 0_0</h1>
          ) : (
            <h1>Feature Flag Is Disabled -_-</h1>
          )
        }
      />
    </section>
  )
}
