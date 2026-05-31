"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// ----------------------------------------------------------------------------
// PasswordInput
// Wraps the Shadcn Input with a show/hide toggle on the right edge. Behaves
// like a normal <Input>; pass id, value, onChange, placeholder, etc as usual.
//
// Notes:
//   • Uses type="password" by default; switches to type="text" when the user
//     clicks the eye button.
//   • Adds right-side padding (pr-9) so the typed text doesn't run into the
//     toggle.
//   • The toggle is a real <button type="button"> so it doesn't accidentally
//     submit the form when clicked.
//   • Forwards ref so it composes with form libs (react-hook-form, etc).
// ----------------------------------------------------------------------------

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, ...props }, ref) {
    const [visible, setVisible] = React.useState(false)
    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn("pr-9", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    )
  },
)
