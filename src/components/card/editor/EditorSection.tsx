import type { ReactNode } from "react"

interface EditorSectionProps {
  title: string
  children: ReactNode
  hint?: string
}

export function EditorSection({ title, children, hint }: EditorSectionProps) {
  return (
    <section className="mb-7">
      <h3 className="mb-3 border-b border-border pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {title}
      </h3>
      {hint && <p className="mb-2.5 text-[11px] text-muted-foreground/70">{hint}</p>}
      {children}
    </section>
  )
}
