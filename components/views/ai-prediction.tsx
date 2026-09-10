'use client'

import { useState } from 'react'
import {
  Brain,
  CloudRain,
  Droplets,
  History,
  Loader2,
  Mountain,
  TriangleAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RiskBadge } from '@/components/risk-badge'
import { computeScore, useDemo, type AiInputs } from '@/lib/demo-context'
import { getRiskLevel, riskLabel } from '@/lib/risk'

const FIELDS: {
  key: keyof AiInputs
  label: string
  icon: typeof CloudRain
  min: number
  max: number
  unit: string
}[] = [
  { key: 'rainfall', label: 'Rainfall', icon: CloudRain, min: 0, max: 180, unit: 'mm/24h' },
  { key: 'soilMoisture', label: 'Soil Moisture', icon: Droplets, min: 0, max: 100, unit: '%' },
  { key: 'slopeAngle', label: 'Slope Angle', icon: Mountain, min: 0, max: 60, unit: '°' },
  { key: 'historicalLandslides', label: 'Historical Landslides', icon: History, min: 0, max: 60, unit: 'events' },
]

function Gauge({ score, level }: { score: number; level: string }) {
  const r = 62
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, score)) / 100
  return (
    <div className="relative flex size-40 items-center justify-center">
      <svg className="size-40 -rotate-90" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r={r} fill="none" stroke="var(--secondary)" strokeWidth="10" />
        <circle
          cx="75"
          cy="75"
          r={r}
          fill="none"
          stroke={`var(--risk-${level})`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="font-mono text-4xl font-bold tabular-nums"
          style={{ color: `var(--risk-${level})` }}
        >
          {score}
        </span>
        <span className="text-[11px] text-muted-foreground">risk / 100</span>
      </div>
    </div>
  )
}

export function AiPredictionView() {
  const { runAiAnalysis, aiResult, aiAnalyzing } = useDemo()
  const [inputs, setInputs] = useState<AiInputs>({
    rainfall: 88,
    soilMoisture: 61,
    slopeAngle: 38,
    historicalLandslides: 42,
  })

  const preview = computeScore(inputs)
  const previewLevel = getRiskLevel(preview)

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="size-4 text-primary" /> AI Risk Analysis — Input Signals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-0">
          {FIELDS.map(({ key, label, icon: Icon, min, max, unit }) => (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Icon className="size-4 text-muted-foreground" />
                  {label}
                </span>
                <span className="font-mono text-sm font-semibold tabular-nums">
                  {inputs[key]}
                  <span className="ml-1 text-[11px] font-normal text-muted-foreground">
                    {unit}
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                value={inputs[key]}
                onChange={(e) =>
                  setInputs((p) => ({ ...p, [key]: Number(e.target.value) }))
                }
                className="w-full accent-primary"
                aria-label={label}
              />
            </div>
          ))}

          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2">
            <span className="text-xs text-muted-foreground">Live model preview</span>
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-sm font-semibold tabular-nums"
                style={{ color: `var(--risk-${previewLevel})` }}
              >
                {preview}
              </span>
              <RiskBadge level={previewLevel} />
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => runAiAnalysis(inputs)}
            disabled={aiAnalyzing}
            className="w-full gap-2 font-semibold"
          >
            {aiAnalyzing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Brain className="size-4" />
            )}
            {aiAnalyzing ? 'Analysing signals…' : 'Run AI Analysis'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Result</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {aiAnalyzing ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm">Running slope-failure inference…</p>
              <div className="w-48 space-y-1.5 text-[11px]">
                {['Ingesting rainfall nowcast', 'Modelling soil saturation', 'Scoring slope stability'].map(
                  (s) => (
                    <p key={s} className="animate-pulse">
                      {s}
                    </p>
                  ),
                )}
              </div>
            </div>
          ) : aiResult ? (
            <div className="animate-rise-in space-y-4">
              <div className="flex items-center gap-5">
                <Gauge score={aiResult.riskScore} level={aiResult.level} />
                <div className="space-y-2">
                  <RiskBadge level={aiResult.level} className="text-sm" />
                  <p className="text-2xl font-bold tracking-tight">
                    {aiResult.riskScore}/100 —{' '}
                    <span style={{ color: `var(--risk-${aiResult.level})` }}>
                      {riskLabel[aiResult.level].toUpperCase()}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    AI confidence{' '}
                    <span className="font-mono font-semibold text-foreground">
                      {aiResult.confidence}%
                    </span>
                  </p>
                </div>
              </div>

              <p className="rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm">
                {aiResult.summary}
              </p>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Main risk factors
                </p>
                <ul className="space-y-1.5">
                  {aiResult.factors.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: `var(--risk-${aiResult.level})` }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="flex items-start gap-3 rounded-lg border p-3"
                style={{
                  borderColor: `color-mix(in oklch, var(--risk-${aiResult.level}) 40%, transparent)`,
                  backgroundColor: `color-mix(in oklch, var(--risk-${aiResult.level}) 8%, transparent)`,
                }}
              >
                <TriangleAlert
                  className="mt-0.5 size-4 shrink-0"
                  style={{ color: `var(--risk-${aiResult.level})` }}
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Recommended action
                  </p>
                  <p className="mt-0.5 text-sm">{aiResult.action}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <Brain className="size-8 opacity-40" />
              <p className="text-sm">Adjust the input signals and run the model</p>
              <p className="text-[11px]">
                Outputs risk score, confidence, level, factors and action
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
