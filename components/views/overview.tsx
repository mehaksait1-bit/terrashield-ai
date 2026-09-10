'use client'

import {
  Bell,
  CloudRain,
  Droplets,
  Gauge,
  Mountain,
  Users,
  Waypoints,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RiskBadge } from '@/components/risk-badge'
import { RiskMap } from '@/components/risk-map'
import { SimulatePanel } from '@/components/simulate-panel'
import { StatCard } from '@/components/stat-card'
import { useDemo } from '@/lib/demo-context'
import { getRiskLevel, riskColor } from '@/lib/risk'

export function OverviewView() {
  const { districts, regionalRisk, activeAlertCount } = useDemo()

  const sorted = [...districts].sort((a, b) => b.riskScore - a.riskScore)
  const highRisk = sorted.filter((d) => d.riskScore >= 60)
  const vulnerableRoads = districts.reduce((s, d) => s + d.vulnerableRoads, 0)
  const vulnerableVillages = districts.reduce((s, d) => s + d.vulnerableVillages, 0)
  const avgRain = Math.round(
    districts.reduce((s, d) => s + d.rainfall, 0) / districts.length,
  )
  const avgSoil = Math.round(
    districts.reduce((s, d) => s + d.soilMoisture, 0) / districts.length,
  )

  // Emergency response priority ordering
  const priority = sorted.slice(0, 4)

  return (
    <div className="space-y-5">
      <SimulatePanel />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          icon={Gauge}
          label="Regional Risk Index"
          value={regionalRisk}
          unit="/ 100"
          sub={`${getRiskLevel(regionalRisk).toUpperCase()} across 7 states`}
          accent={riskColor(regionalRisk)}
        />
        <StatCard
          icon={Bell}
          label="Active Alerts"
          value={activeAlertCount}
          sub="High & critical warnings"
          accent={activeAlertCount > 0 ? 'var(--risk-high)' : 'var(--risk-low)'}
        />
        <StatCard
          icon={Mountain}
          label="High-Risk Locations"
          value={highRisk.length}
          sub="Districts above threshold"
          accent={highRisk.length > 0 ? 'var(--risk-high)' : 'var(--risk-low)'}
        />
        <StatCard
          icon={Waypoints}
          label="Vulnerable Infrastructure"
          value={vulnerableRoads}
          unit="roads"
          sub={`${vulnerableVillages} villages exposed`}
          accent="var(--primary)"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Northeast India — Live Risk Map</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <RiskMap />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>High-Risk Locations</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {sorted.map((d) => {
                const level = getRiskLevel(d.riskScore)
                return (
                  <li
                    key={d.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{d.name}</p>
                      <p className="text-[11px] text-muted-foreground">{d.state}</p>
                    </div>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${d.riskScore}%`,
                          backgroundColor: `var(--risk-${level})`,
                        }}
                      />
                    </div>
                    <span
                      className="w-7 text-right font-mono text-sm font-semibold tabular-nums"
                      style={{ color: `var(--risk-${level})` }}
                    >
                      {d.riskScore}
                    </span>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudRain className="size-4 text-primary" /> Rainfall
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-3xl font-semibold tabular-nums">
                {avgRain}
              </span>
              <span className="text-sm text-muted-foreground">mm / 24h avg</span>
            </div>
            <div className="mt-4 space-y-2">
              {[...districts]
                .sort((a, b) => b.rainfall - a.rainfall)
                .slice(0, 4)
                .map((d) => (
                  <div key={d.id} className="flex items-center gap-2 text-xs">
                    <span className="w-28 shrink-0 truncate text-muted-foreground">
                      {d.state}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${Math.min(100, (d.rainfall / 180) * 100)}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-mono tabular-nums">
                      {Math.round(d.rainfall)}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="size-4 text-primary" /> Soil Moisture
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-3xl font-semibold tabular-nums">
                {avgSoil}
              </span>
              <span className="text-sm text-muted-foreground">% saturation avg</span>
            </div>
            <div className="mt-4 space-y-2">
              {[...districts]
                .sort((a, b) => b.soilMoisture - a.soilMoisture)
                .slice(0, 4)
                .map((d) => {
                  const sat = d.soilMoisture
                  const color =
                    sat >= 85
                      ? 'var(--risk-critical)'
                      : sat >= 70
                        ? 'var(--risk-high)'
                        : 'var(--primary)'
                  return (
                    <div key={d.id} className="flex items-center gap-2 text-xs">
                      <span className="w-28 shrink-0 truncate text-muted-foreground">
                        {d.state}
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${sat}%`, backgroundColor: color }}
                        />
                      </div>
                      <span className="w-10 text-right font-mono tabular-nums">
                        {Math.round(sat)}%
                      </span>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-4 text-primary" /> Emergency Response Priority
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ol className="space-y-2">
              {priority.map((d, i) => {
                const level = getRiskLevel(d.riskScore)
                return (
                  <li
                    key={d.id}
                    className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
                  >
                    <span
                      className="flex size-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold"
                      style={{
                        backgroundColor: `color-mix(in oklch, var(--risk-${level}) 18%, transparent)`,
                        color: `var(--risk-${level})`,
                      }}
                    >
                      P{i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{d.state}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {(d.population / 1000).toFixed(0)}k residents ·{' '}
                        {d.vulnerableVillages} villages
                      </p>
                    </div>
                    <RiskBadge level={level} />
                  </li>
                )
              })}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
