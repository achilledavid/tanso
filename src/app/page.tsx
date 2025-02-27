import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Fragment } from "react"

export default function Home() {
  return (
    <Fragment>
      <p>welcome to tanso!</p>
      <Button size="sm" asChild>
        <Link href="/sessions/2">go to session</Link>
      </Button>
    </Fragment>
  )
}
