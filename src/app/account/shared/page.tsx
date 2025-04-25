import { SharedProjects } from "@/components/shared-projects";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function AccountSharedProjectsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) notFound();

  return (
    <SharedProjects />
  )
}
