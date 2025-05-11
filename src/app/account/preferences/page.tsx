import Preferences from "@/components/preferences/preferences";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function AccountPreferences() {
  const session = await getServerSession(authOptions);
  const username = session?.user.username;

  if (!username) notFound();

  return (
    <Preferences userId={session.user.id} />
  )
}
