"use client";

import { useEffect, useState } from "react";
import { useHAStore } from "@/stores/ha";

export function HAProvider({ children }: { children: React.ReactNode }) {
  const { status, init, error } = useHAStore();
  const [config, setConfig] = useState<{ url: string; token: string } | null>(null);

  useEffect(() => {
    const url = localStorage.getItem("ha_url") || "";
    const token = localStorage.getItem("ha_token") || "";
    if (url && token) {
      setConfig({ url, token });
      init(url, token);
    } else {
      setConfig(null);
    }
  }, [init]);

  if (!config?.url || !config?.token) {
    return <SetupForm onSave={(url, token) => { localStorage.setItem("ha_url", url); localStorage.setItem("ha_token", token); setConfig({ url, token }); init(url, token); }} />;
  }

  if (status === "connecting") {
    return <div className="flex h-dvh items-center justify-center text-text-muted">Connecting...</div>;
  }

  if (status === "error") {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-danger">Connection failed</p>
        <p className="text-sm text-text-muted">{error}</p>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="rounded-md bg-surface-2 px-4 py-2 text-sm">Reset</button>
      </div>
    );
  }

  return <>{children}</>;
}

function SetupForm({ onSave }: { onSave: (url: string, token: string) => void }) {
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-xl font-semibold">Connect to Home Assistant</h1>
      <input placeholder="http://homeassistant.local:8123" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full max-w-sm rounded-md bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none" />
      <input placeholder="Long-lived access token" value={token} onChange={(e) => setToken(e.target.value)} type="password" className="w-full max-w-sm rounded-md bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none" />
      <button onClick={() => onSave(url, token)} className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-white">Connect</button>
    </div>
  );
}
