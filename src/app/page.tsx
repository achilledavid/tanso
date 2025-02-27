"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Pad from "@/components/pad";
import Link from "next/link";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div>
      <nav className="p-4 bg-violet-600 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            BeatFlow
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-violet-700 transition"
            >
              {session.user?.name}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 text-gray-700">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-violet-50 hover:text-violet-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </Link>

                <div className="h-px bg-gray-200 my-1" />

                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/auth/login" });
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div>
        <Pad />
      </div>
    </div>
  );
}
