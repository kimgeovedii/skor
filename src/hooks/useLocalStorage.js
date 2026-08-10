import { useState, useEffect } from "react";

/**
 * Persists state to localStorage with automatic sync.
 * Falls back to initialValue if storage read/write fails.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage full or unavailable — silently ignore
    }
  }, [key, value]);

  return [value, setValue];
}
