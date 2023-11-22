import { useEffect, useState } from "react";

export default function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const item = localStorage.getItem(key);

    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }

    setValue(item ? JSON.parse(item) : defaultValue);

    function handler(e) {
      if (e.key !== key) return;

      const lsi = localStorage.getItem(key);
      setValue(JSON.parse(lsi || ""));
    }

    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("storage", handler);
    };
  }, []);

  const setValueWrap = (value) => {
    try {
      setValue(value);

      localStorage.setItem(key, JSON.stringify(value));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new StorageEvent("storage", { key }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return [value, setValueWrap];
}
