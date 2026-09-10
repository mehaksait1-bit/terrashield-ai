'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { useDemo } from '@/lib/demo-context'
import { getRiskLevel, riskLabel } from '@/lib/risk'
import { cn } from '@/lib/utils'
import type { District, RiskLevel } from '@/lib/types'

const LEGEND: RiskLevel[] = ['low', 'moderate', 'high', 'critical']

export function RiskMap({
  className,
  showReports = true,
  selectable = false,
}: {
  className?: string
  showReports?: boolean
  selectable?: boolean
}) {
  const { districts, reports, focusDistrictId } = useDemo()
  const [selected, setSelected] = useState<District | null>(null)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-cover bg-center"
        style={{ backgroundImage: 'url(/ne-india-terrain.png)' }}
      >
        <div className="absolute inset-0 bg-background/40" />

        {/* district risk nodes */}
        {districts.map((d) => {
          const level = getRiskLevel(d.riskScore)
          const color = `var(--risk-${level})`
          const isFocus = d.id === focusDistrictId
          const pulse = level === 'critical' || level === 'high'
          return (
            <button
              key={d.id}
              type="button"
              disabled={!selectable}
              onClick={() => selectable && setSelected(selected?.id === d.id ? null : d)}
              className={cn(
                'group absolute -translate-x-1/2 -translate-y-1/2',
                selectable ? 'cursor-pointer' : 'cursor-default',
              )}
              style={{ left: `${d.x}%`, top: `${d.y}%` }}
              aria-label={`${d.state}: risk ${d.riskScore}, ${riskLabel[level]}`}
            >
              {pulse && (
                <span
                  className="animate-pulse-ring absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden
                />
              )}
              <span
                className="relative flex size-4 items-center justify-center rounded-full ring-2 ring-background/70 transition-transform group-hover:scale-125"
                style={{ backgroundColor: color }}
              >
                {isFocus && (
                  <span className="size-1.5 rounded-full bg-background/90" aria-hidden />
                )}
              </span>
              <span
                className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card/95 px-1.5 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur"
              >
                {d.state}{' '}
                <span
                  className="font-mono font-semibold tabular-nums"
                  style={{ color }}
                >
                  {d.riskScore}
                </span>
              </span>
            </button>
          )
        })}

        {/* field report pins */}
        {showReports &&
          reports.map((r) => (
            <span
              key={r.id}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${r.x}%`, top: `${r.y}%` }}
              title={`${r.type} — ${r.location}`}
            >
              <MapPin
                className="size-4 drop-shadow"
                style={{ color: `var(--risk-${r.severity})` }}
                fill={`color-mix(in oklch, var(--risk-${r.severity}) 30%, transparent)`}
              />
            </span>
          ))}

        {/* legend */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-2 rounded-lg border border-border bg-card/85 px-2.5 py-1.5 backdrop-blur">
          {LEGEND.map((l) => (
            <span key={l} className="flex items-center gap-1 text-[10px] font-medium">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: `var(--risk-${l})` }}
              />
              {riskLabel[l]}
            </span>
          ))}
        </div>

        {selectable && selected && (
          <div className="absolute right-2 top-2 w-48 rounded-lg border border-border bg-card/95 p-3 text-xs shadow-lg backdrop-blur">
            <p className="font-semibold">{selected.name}</p>
            <p className="text-muted-foreground">{selected.state}</p>
            <div className="mt-2 grid grid-cols-2 gap-y-1 font-mono tabular-nums">
              <span className="text-muted-foreground">Risk</span>
              <span
                className="text-right font-semibold"
                style={{ color: `var(--risk-${getRiskLevel(selected.riskScore)})` }}
              >
                {selected.riskScore}
              </span>
              <span className="text-muted-foreground">Rainfall</span>
              <span className="text-right">{Math.round(selected.rainfall)}mm</span>
              <span className="text-muted-foreground">Soil</span>
              <span className="text-right">{Math.round(selected.soilMoisture)}%</span>
              <span className="text-muted-foreground">Slope</span>
              <span className="text-right">{selected.slopeAngle}°</span>
            </div>
          </div>
        )}
      </div>

      {selectable && (
        <p className="text-center text-[11px] text-muted-foreground">
          Select a monitoring node to inspect live conditions
        </p>
      )}
    </div>
  )
}
