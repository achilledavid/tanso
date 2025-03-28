import Library from "@/components/library/library";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function AccountLibrary() {
  const session = await getServerSession(authOptions);
  const username = session?.user.username;

  if (!username) notFound();

  return (
    <Library folder={username} />
  )
}
