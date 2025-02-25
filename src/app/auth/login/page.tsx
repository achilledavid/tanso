"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-600 to-violet-900">
      <div className="p-8 bg-white rounded-lg shadow-xl w-96">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-violet-600">BeatFlow</h1>
          <p className="text-gray-600 mt-2">Create music together</p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition text-center"
        >
          <Image
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
            width="20"
            height="20"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
