'use client'

import { Bell, TriangleAlert, X } from 'lucide-react'
import { useDemo } from '@/lib/demo-context'
import { cn } from '@/lib/utils'

export function Notifications() {
  const { notifications, dismissNotification } = useDemo()

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,22rem)] flex-col gap-2">
      {notifications.map((n) => {
        const isAlert = n.level !== 'info'
        return (
          <div
            key={n.id}
            role="status"
            className={cn(
              'animate-rise-in pointer-events-auto flex items-start gap-3 rounded-xl border bg-card/95 p-3 shadow-lg backdrop-blur',
              isAlert ? 'border-border' : 'border-border',
            )}
            style={
              isAlert
                ? { borderColor: `color-mix(in oklch, var(--risk-${n.level}) 45%, transparent)` }
                : undefined
            }
          >
            <span
              className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor:
                  n.level === 'info'
                    ? 'color-mix(in oklch, var(--primary) 18%, transparent)'
                    : `color-mix(in oklch, var(--risk-${n.level}) 18%, transparent)`,
                color:
                  n.level === 'info' ? 'var(--primary)' : `var(--risk-${n.level})`,
              }}
            >
              {isAlert ? (
                <TriangleAlert className="size-4" />
              ) : (
                <Bell className="size-4" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold leading-tight">{n.title}</p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                {n.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dismissNotification(n.id)}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Dismiss notification"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
