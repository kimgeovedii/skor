import { useState, useCallback, useRef } from "react";

/**
 * Persists state to localStorage with automatic sync.
 * Returns [value, setValue, valueRef] — valueRef always holds the latest value
 * so it can be read synchronously even before React re-renders.
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

  const valueRef = useRef(value);

  const setStoredValue = useCallback((newValue) => {
    const resolved = typeof newValue === "function" ? newValue(valueRef.current) : newValue;
    valueRef.current = resolved;
    setValue(resolved);
    try {
      localStorage.setItem(key, JSON.stringify(resolved));
    } catch {
      // localStorage full or unavailable — silently ignore
    }
  }, [key]);

  return [value, setStoredValue, valueRef];
}
