'use client'

import { Clock, MapPin, ShieldCheck, TriangleAlert } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { RiskBadge } from '@/components/risk-badge'
import { useDemo } from '@/lib/demo-context'
import { clockTime, timeAgo } from '@/lib/format'

export function AlertsView() {
  const { alerts } = useDemo()
  const order = { critical: 0, high: 1, moderate: 2, low: 3 }
  const sorted = [...alerts].sort(
    (a, b) => order[a.level] - order[b.level] || b.time - a.time,
  )
  const critical = alerts.filter((a) => a.level === 'critical').length
  const high = alerts.filter((a) => a.level === 'high').length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Critical</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-risk-critical">
            {critical}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">High</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-risk-high">
            {high}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total active</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">
            {alerts.length}
          </p>
        </Card>
      </div>

      <div className="space-y-3">
        {sorted.map((a) => (
          <Card
            key={a.id}
            className="animate-rise-in overflow-hidden"
            style={{
              borderColor: `color-mix(in oklch, var(--risk-${a.level}) 35%, transparent)`,
            }}
          >
            <div
              className="h-1 w-full"
              style={{ backgroundColor: `var(--risk-${a.level})` }}
            />
            <CardContent className="py-4">
              <div className="flex flex-wrap items-start gap-4">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `color-mix(in oklch, var(--risk-${a.level}) 16%, transparent)`,
                    color: `var(--risk-${a.level})`,
                  }}
                >
                  <TriangleAlert className="size-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <RiskBadge level={a.level} />
                    <span className="flex items-center gap-1 text-sm font-medium">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      {a.location}
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="size-3" />
                      {clockTime(a.time)} · {timeAgo(a.time)}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-[auto_1fr]">
                    <div className="flex flex-col items-center justify-center rounded-lg bg-secondary/50 px-4 py-2">
                      <span
                        className="font-mono text-2xl font-bold tabular-nums"
                        style={{ color: `var(--risk-${a.level})` }}
                      >
                        {a.riskScore}
                      </span>
                      <span className="text-[10px] text-muted-foreground">risk / 100</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <p>
                        <span className="font-semibold text-muted-foreground">Cause: </span>
                        {a.cause}
                      </p>
                      <p className="flex items-start gap-1.5">
                        <ShieldCheck
                          className="mt-0.5 size-3.5 shrink-0"
                          style={{ color: `var(--risk-${a.level})` }}
                        />
                        <span>
                          <span className="font-semibold text-muted-foreground">
                            Recommended action:{' '}
                          </span>
                          {a.action}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
