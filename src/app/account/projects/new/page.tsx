import NewProject from "@/components/new-project";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function AccountNewProject() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) notFound();

  return (
    <NewProject userId={userId} />
  )
}
