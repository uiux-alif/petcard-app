"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import { CheckCircle2, XCircle, Info } from "lucide-react"
import type { ToastMessage, ToastType } from "@/types/card"
import { cn } from "@/lib/utils"

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void
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

  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = `toast-${counter++}`
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2800)
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
                "pointer-events-auto flex items-center gap-2 rounded-md border bg-card px-4 py-2.5 text-sm shadow-lg",
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
