"use client";

import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/user";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function Account() {
  const session = useSession();
  const userId = session.data?.user.id;

  if (session.status === "unauthenticated") redirect("/login");

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null;
      return getUser(userId);
    },
    enabled: !!userId,
  });

  if (!session.data?.user) return null;
  if (!user && !isLoading) notFound();
  else redirect("/account/projects")
}
