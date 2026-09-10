'use client'

import { useEffect, useState } from 'react'
import { Bell, Radio } from 'lucide-react'
import { useDemo } from '@/lib/demo-context'
import { getRiskLevel, riskLabel } from '@/lib/risk'
import type { ViewId } from '@/lib/types'

const TITLES: Record<ViewId, { title: string; sub: string }> = {
  overview: { title: 'Command Overview', sub: 'Regional situational awareness' },
  map: { title: 'Live Risk Map', sub: 'Northeast India slope monitoring' },
  prediction: { title: 'AI Risk Prediction', sub: 'Machine-learning slope failure model' },
  reports: { title: 'Field Reports', sub: 'Crowdsourced ground observations' },
  alerts: { title: 'Alert Center', sub: 'Active early warnings' },
  analytics: { title: 'Analytics', sub: 'Trends and historical intelligence' },
}

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="font-mono text-xs tabular-nums text-muted-foreground">
      {now
        ? now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST'
        : '--:--:-- IST'}
    </span>
  )
}

export function Topbar() {
  const { activeView, regionalRisk, peakRisk, activeAlertCount, setActiveView } =
    useDemo()
  const meta = TITLES[activeView]
  const peakLevel = getRiskLevel(peakRisk)

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:px-6">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold tracking-tight">{meta.title}</h1>
          <span className="flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <Radio className="size-3 animate-pulse" />
            Demo Mode — Simulated Data
          </span>
        </div>
        <p className="truncate text-xs text-muted-foreground">{meta.sub}</p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <LiveClock />
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 sm:flex">
          <span className="text-[11px] text-muted-foreground">Regional</span>
          <span className="font-mono text-sm font-semibold tabular-nums">
            {regionalRisk}
          </span>
          <span
            className="text-[11px] font-semibold uppercase"
            style={{ color: `var(--risk-${getRiskLevel(regionalRisk)})` }}
          >
            {riskLabel[getRiskLevel(regionalRisk)]}
          </span>
        </div>
        <div
          className="hidden items-center gap-2 rounded-lg border px-3 py-1.5 md:flex"
          style={{
            borderColor: `color-mix(in oklch, var(--risk-${peakLevel}) 40%, transparent)`,
            backgroundColor: `color-mix(in oklch, var(--risk-${peakLevel}) 10%, transparent)`,
          }}
        >
          <span className="text-[11px] text-muted-foreground">Peak</span>
          <span
            className="font-mono text-sm font-semibold tabular-nums"
            style={{ color: `var(--risk-${peakLevel})` }}
          >
            {peakRisk}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setActiveView('alerts')}
          className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          aria-label={`${activeAlertCount} active alerts`}
        >
          <Bell className="size-4" />
          {activeAlertCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-risk-critical text-[10px] font-bold text-background">
              {activeAlertCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
