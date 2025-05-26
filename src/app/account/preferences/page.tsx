import Preferences from "./components/grid";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function AccountPreferences() {
  const session = await getServerSession(authOptions);
  const username = session?.user.username;

  if (!username) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className='text-2xl font-semibold text-gray-100 font-["Deezer"] uppercase'>Preferences</h1>
        <div className="mt-1 text-muted-foreground text-sm">
          <p>These are the default shortcuts that will be used when creating a new project.</p>
          <p>You can customize them later in your project settings if you wish.</p>
        </div>
      </div>
      <div className="max-w-[25rem] w-full">
        <Preferences userId={session.user.id} />
      </div>
    </div >
  )
}
