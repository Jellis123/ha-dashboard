"use client";

import { useEffect, useState } from "react";
import { useHAStore } from "@/stores/ha";
import type { Connection } from "home-assistant-js-websocket";

interface TodoItem {
  uid: string;
  summary: string;
  status: "needs_action" | "completed";
}

export function ShoppingList() {
  const connection = useHAStore((s) => s.connection);
  const [items, setItems] = useState<TodoItem[]>([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    if (!connection) return;
    fetchItems(connection);
  }, [connection]);

  const fetchItems = async (conn: Connection) => {
    try {
      const result = await conn.sendMessagePromise<{ response: Record<string, { items: TodoItem[] }> }>({
        type: "execute_script",
        sequence: [{ action: "todo.get_items", target: { entity_id: "todo.shopping_list" }, data: { status: "needs_action" }, response_variable: "items" }],
      });
      const items = Object.values(result.response)?.[0]?.items || [];
      setItems(items);
    } catch {
      // fallback: just show empty
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connection || !newItem.trim()) return;
    await connection.sendMessagePromise({
      type: "call_service",
      domain: "todo",
      service: "add_item",
      service_data: { item: newItem.trim() },
      target: { entity_id: "todo.shopping_list" },
    });
    setNewItem("");
    fetchItems(connection);
  };

  const removeItem = async (uid: string) => {
    if (!connection) return;
    await connection.sendMessagePromise({
      type: "call_service",
      domain: "todo",
      service: "remove_item",
      service_data: { item: uid },
      target: { entity_id: "todo.shopping_list" },
    });
    setItems((prev) => prev.filter((i) => i.uid !== uid));
  };

  return (
    <section>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Shopping List</h2>
      <div className="rounded-lg border border-border-subtle bg-surface-1 p-4">
        <form onSubmit={addItem} className="mb-3 flex gap-2">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add item..."
            className="flex-1 rounded-md bg-surface-2 px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted"
          />
          <button type="submit" className="rounded-md bg-accent px-3 py-2 text-sm text-white">+</button>
        </form>
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.uid} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-text-primary hover:bg-surface-2">
              <span>{item.summary}</span>
              <button onClick={() => removeItem(item.uid)} className="text-text-muted text-xs">✕</button>
            </li>
          ))}
          {items.length === 0 && <li className="text-xs text-text-muted py-2">List is empty</li>}
        </ul>
      </div>
    </section>
  );
}
