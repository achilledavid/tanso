import { MyProjects } from "@/components/project/my-projects/my-projects";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function AccountProjects() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) notFound();

  return (
    <MyProjects userId={userId} />
  )
}
