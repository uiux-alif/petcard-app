"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import { CheckCircle2, XCircle, Info } from "lucide-react"
import type { ToastType } from "@/types/card"
import { cn } from "@/lib/utils"

interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastMessage {
  id: string
  message: string
  type: ToastType
  action?: ToastAction
  durationMs: number
}

interface ToastContextValue {
  show: (
    message: string,
    type?: ToastType,
    options?: { action?: ToastAction; durationMs?: number },
  ) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
} as const

let counter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const show = useCallback<ToastContextValue["show"]>((message, type = "success", options) => {
    const id = `toast-${counter++}`
    const durationMs = options?.durationMs ?? 2800
    setToasts((prev) => [...prev, { id, message, type, action: options?.action, durationMs }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, durationMs)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed bottom-8 left-1/2 z-[200] flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type]
          return (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-md border bg-card px-4 py-2.5 text-sm shadow-lg",
                "animate-in fade-in slide-in-from-bottom-3",
                toast.type === "error" && "border-destructive/40",
                toast.type === "success" && "border-primary/40",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  toast.type === "success" && "text-primary",
                  toast.type === "error" && "text-destructive",
                  toast.type === "info" && "text-muted-foreground",
                )}
              />
              <span>{toast.message}</span>
              {toast.action && (
                <button
                  type="button"
                  onClick={toast.action.onClick}
                  className="rounded border border-border px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground hover:bg-secondary"
                >
                  {toast.action.label}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within a ToastProvider")
  return ctx
}
