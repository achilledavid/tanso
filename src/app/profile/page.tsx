"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Check, X } from "lucide-react";
import Image from "next/image";
import { Session } from "next-auth";

// Extension du type Session
interface ExtendedSession extends Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string | number;
  };
}

interface UserProfile {
  theme: string;
  defaultBpm: number;
  metronomeEnabled: boolean;
  volumeDefault: number;
  preferredPadSize: number;
}

interface UserData {
  id: number;
  username: string;
  avatarUrl: string | null;
  profile: UserProfile;
}

export default function Profile() {
  const { data: session, status } = useSession() as {
    data: ExtendedSession | null;
    status: "loading" | "authenticated" | "unauthenticated";
  };

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<{
    username: string;
    theme: string;
    defaultBpm: number;
    volumeDefault: number;
  }>({
    username: "",
    theme: "dark",
    defaultBpm: 120,
    volumeDefault: 1.0,
  });

  // État pour le nom d'utilisateur
  const [usernameStatus, setUsernameStatus] = useState<
    "checking" | "available" | "taken" | "initial"
  >("initial");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour vérifier la disponibilité du nom d'utilisateur
  const checkUsernameAvailability = useCallback(
    async (username: string) => {
      if (!username || username === userData?.username) {
        setUsernameStatus("initial");
        return;
      }

      setUsernameStatus("checking");

      try {
        const response = await fetch(
          `/api/users/check-username?username=${encodeURIComponent(username)}`
        );
        const data = await response.json();

        setUsernameStatus(data.available ? "available" : "taken");
      } catch (error) {
        console.error("Failed to check username:", error);
        setUsernameStatus("initial");
      }
    },
    [userData?.username]
  );

  // Effet pour mettre à jour le nom d'utilisateur avec debounce
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      checkUsernameAvailability(formData.username);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [formData.username, checkUsernameAvailability]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setUserData(data);

            // Initialize form data
            setFormData({
              username: data.username,
              theme: data.profile.theme,
              defaultBpm: data.profile.defaultBpm,
              volumeDefault: data.profile.volumeDefault,
            });
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const handleUpdateProfile = async () => {
    if (
      !session?.user?.id ||
      !userData ||
      usernameStatus === "checking" ||
      usernameStatus === "taken"
    )
      return;

    setIsUpdating(true);

    try {
      const updateData = {
        username: formData.username,
        profile: {
          theme: formData.theme,
          defaultBpm: formData.defaultBpm,
          volumeDefault: formData.volumeDefault,
        },
      };

      console.log("Sending update:", updateData);

      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
        alert("Profile updated successfully!");
      } else {
        const error = await response.json();
        console.error("Update failed:", error);
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("An error occurred while updating profile");
    } finally {
      setIsUpdating(false);
    }
  };

  if (status === "loading" || !userData || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-600"></div>
      </div>
    );
  }

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-violet-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-violet-200 transition">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold">Profile Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <Image
                src={
                  userData.avatarUrl ||
                  session.user?.image ||
                  "/default-avatar.png"
                }
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover"
                width={80}
                height={80}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  // Handle image upload
                  const file = e.target.files?.[0];
                  if (file) {
                    // Add your image upload logic here
                  }
                }}
                className="text-sm"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded pr-10 focus:outline-none focus:ring-2 ${
                  usernameStatus === "available"
                    ? "border-green-500 focus:ring-green-500"
                    : usernameStatus === "taken"
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-violet-500"
                }`}
              />
              {usernameStatus === "checking" && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-5 w-5 border-2 border-violet-500 rounded-full border-t-transparent"></div>
                </div>
              )}
              {usernameStatus === "available" && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                  <Check size={20} />
                </div>
              )}
              {usernameStatus === "taken" && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                  <X size={20} />
                </div>
              )}
            </div>
            {usernameStatus === "taken" && (
              <p className="mt-1 text-sm text-red-500">
                This username is already taken
              </p>
            )}
            {usernameStatus === "available" && (
              <p className="mt-1 text-sm text-green-500">
                Username is available
              </p>
            )}
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={formData.theme}
              onChange={(e) =>
                setFormData({ ...formData, theme: e.target.value })
              }
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          {/* Default BPM */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default BPM
            </label>
            <input
              type="number"
              value={formData.defaultBpm}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  defaultBpm: parseInt(e.target.value),
                })
              }
              min="60"
              max="200"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Default Volume */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Volume
            </label>
            <input
              type="range"
              value={formData.volumeDefault}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  volumeDefault: parseFloat(e.target.value),
                })
              }
              min="0"
              max="1"
              step="0.1"
              className="w-full"
            />
            <div className="text-sm text-gray-500 mt-1">
              {Math.round(formData.volumeDefault * 100)}%
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleUpdateProfile}
              disabled={
                isUpdating ||
                usernameStatus === "checking" ||
                usernameStatus === "taken"
              }
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
