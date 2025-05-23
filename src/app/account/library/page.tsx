import Library from "@/components/library/library";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import style from "./library.module.scss"

export default async function AccountLibrary() {
  const session = await getServerSession(authOptions);
  const username = session?.user.username;

  if (!username) notFound();

  return (
    <div className={style.container}>
      <Library username={username} />
    </div>
  )
}
