"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CmsLoginPage() {
  const router = useRouter();
  const [secret, setSecret] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    document.cookie = `cms-token=${encodeURIComponent(secret.trim())}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax; Secure`;

    router.push("/cms");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">CMS Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the CMS secret to access the editor.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="secret" className="text-sm font-medium">
              Secret
            </label>
            <input
              id="secret"
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter CMS secret"
              required
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
