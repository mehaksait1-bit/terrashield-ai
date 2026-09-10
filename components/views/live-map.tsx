'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RiskBadge } from '@/components/risk-badge'
import { RiskMap } from '@/components/risk-map'
import { useDemo } from '@/lib/demo-context'
import { getRiskLevel } from '@/lib/risk'

export function LiveMapView() {
  const { districts, reports } = useDemo()
  const sorted = [...districts].sort((a, b) => b.riskScore - a.riskScore)

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Interactive Risk Surface</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <RiskMap selectable showReports />
          <p className="mt-3 text-[11px] text-muted-foreground">
            {reports.length} field report{reports.length === 1 ? '' : 's'} plotted ·
            Nodes pulse when risk is High or Critical
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Monitored Zones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {sorted.map((d) => {
            const level = getRiskLevel(d.riskScore)
            return (
              <div
                key={d.id}
                className="rounded-lg border border-border bg-secondary/30 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.name}</p>
                    <p className="text-[11px] text-muted-foreground">{d.state}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-lg font-semibold tabular-nums"
                      style={{ color: `var(--risk-${level})` }}
                    >
                      {d.riskScore}
                    </span>
                    <RiskBadge level={level} />
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2 text-[11px]">
                  <Metric label="Rain" value={`${Math.round(d.rainfall)}mm`} />
                  <Metric label="Soil" value={`${Math.round(d.soilMoisture)}%`} />
                  <Metric label="Slope" value={`${d.slopeAngle}°`} />
                  <Metric label="Roads" value={String(d.vulnerableRoads)} />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-background/60 px-2 py-1.5 text-center">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-mono font-semibold tabular-nums">{value}</p>
    </div>
  )
}
