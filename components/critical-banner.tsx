'use client'

import { TriangleAlert, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDemo } from '@/lib/demo-context'

export function CriticalBanner() {
  const { criticalWarning, dismissCriticalWarning, setActiveView } = useDemo()
  if (!criticalWarning) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-40 flex justify-center px-4">
      <div className="animate-rise-in pointer-events-auto flex w-full max-w-2xl items-start gap-4 rounded-xl border border-risk-critical/50 bg-card p-4 shadow-2xl ring-1 ring-risk-critical/30">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-risk-critical/20 text-risk-critical">
          <TriangleAlert className="size-6 animate-pulse" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-risk-critical">
            Critical Early Warning Generated
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug">
            Mangan / North Sikkim escalated{' '}
            <span className="font-mono text-risk-moderate">54 Moderate</span>
            {' → '}
            <span className="font-mono text-risk-critical">89 Critical</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Immediate field inspection recommended. Emergency response priority
            updated and district authorities notified.
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setActiveView('alerts')
                dismissCriticalWarning()
              }}
              className="bg-risk-critical/15 text-risk-critical hover:bg-risk-critical/25"
            >
              View alert
            </Button>
            <Button size="sm" variant="ghost" onClick={dismissCriticalWarning}>
              Acknowledge
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismissCriticalWarning}
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Dismiss warning"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
