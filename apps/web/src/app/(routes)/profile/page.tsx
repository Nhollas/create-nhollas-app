import { UserProfile, auth, currentUser } from "@clerk/nextjs"
import { Fragment } from "react"

export default async function Profile() {
  const user = await currentUser()
  const authResult = auth()

  return (
    <Fragment>
      <UserProfile />
      <pre className="text-sm">{JSON.stringify(user, null, 4)}</pre>
      <pre className="text-sm">{JSON.stringify(authResult, null, 4)}</pre>
    </Fragment>
  )
}
