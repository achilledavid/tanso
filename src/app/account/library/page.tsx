import Library from "@/components/library/library";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function AccountLibrary() {
  const session = await getServerSession(authOptions);
  const username = session?.user.username;

  if (!username) notFound();

  return (
    <div className="flex flex-col gap-4 max-w-[40rem] w-full">
      <div className="flex items-center justify-between">
        <h1 className='text-2xl font-semibold text-gray-100 font-["Deezer"] uppercase'>Libraries</h1>
      </div>
      <Library username={username} isDark />
    </div>
  )
}
