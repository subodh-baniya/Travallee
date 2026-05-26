import { useState } from "react";
import { ToastType, ToastState } from "./Toast";

export const useToast = () => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (type: ToastType, text: string) => {
    setToast({ type, text });
    if (type === "error") {
      setTimeout(() => setToast(null), 4000);
    }
  };

  const clearToast = () => setToast(null);

  return { toast, showToast, clearToast };
};
