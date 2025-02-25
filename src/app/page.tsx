"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Pad from "@/components/pad";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div>
      <nav className="p-4 bg-violet-600 text-white">
        <div className="flex justify-between items-center">
          <h1>BeatFlow</h1>
          <div className="flex gap-4 items-center">
            <span>{session.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="px-4 py-2 bg-violet-700 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div>
        <Pad />
      </div>
    </div>
  );
}
