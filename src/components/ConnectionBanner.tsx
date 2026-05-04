"use client";

import { useConnectionStatus } from "@/hooks/useEntity";
import { motion, AnimatePresence } from "framer-motion";

export function ConnectionBanner() {
  const status = useConnectionStatus();
  const show = status === "disconnected" || status === "connecting";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="fixed inset-x-0 top-0 z-50 overflow-hidden"
        >
          <div className="bg-warning/90 px-4 py-2 text-center text-xs font-medium text-black">
            {status === "connecting" ? "Reconnecting..." : "Disconnected from Home Assistant"}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
