"use client";

import { useEffect, useState } from "react";
import { useHAStore } from "@/stores/ha";

export function HAProvider({ children }: { children: React.ReactNode }) {
  const status = useHAStore((s) => s.status);
  const init = useHAStore((s) => s.init);
  const error = useHAStore((s) => s.error);
  const [config, setConfig] = useState<{ url: string; token: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const url = localStorage.getItem("ha_url") || "";
    const token = localStorage.getItem("ha_token") || "";
    if (url && token) {
      setConfig({ url, token });
      init(url, token);
    }
  }, [init]);

  if (!mounted) return null;

  if (!config?.url || !config?.token) {
    return (
      <SetupForm
        onSave={(url, token) => {
          localStorage.setItem("ha_url", url);
          localStorage.setItem("ha_token", token);
          setConfig({ url, token });
          init(url, token);
        }}
      />
    );
  }

  if (status === "connecting") {
    return (
      <div className="flex h-dvh items-center justify-center text-text-muted">
        Connecting to Home Assistant...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-danger">Connection failed</p>
        <p className="text-sm text-text-muted">{error}</p>
        <button
          onClick={() => {
            localStorage.clear();
            setConfig(null);
          }}
          className="rounded-md bg-surface-2 px-4 py-2 text-sm text-text-primary"
        >
          Reset
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

function SetupForm({ onSave }: { onSave: (url: string, token: string) => void }) {
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !token) return;
    setLoading(true);
    onSave(url.replace(/\/$/, ""), token.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-dvh flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-xl font-semibold text-text-primary">Connect to Home Assistant</h1>
      <input
        placeholder="http://homeassistant.local:8123"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full max-w-sm rounded-md bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted"
        required
      />
      <input
        placeholder="Long-lived access token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        type="password"
        className="w-full max-w-sm rounded-md bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted"
        required
      />
      <button
        type="submit"
        disabled={loading || !url || !token}
        className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Connecting..." : "Connect"}
      </button>
    </form>
  );
}
