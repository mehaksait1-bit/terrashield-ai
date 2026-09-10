'use client'

import { CloudRain, RotateCcw, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useDemo } from '@/lib/demo-context'
import { cn } from '@/lib/utils'

const STEPS = [
  'Rainfall',
  'Soil moisture',
  'AI analysis',
  'Risk score',
  'Map critical',
  'Alert',
  'Response',
]

export function SimulatePanel() {
  const { simulateHeavyRainfall, resetDemo, simRunning, simPhase } = useDemo()

  return (
    <Card className="overflow-hidden">
      <div className="relative border-b border-border bg-primary/[0.06] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-md">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Main demo scenario
            </p>
            <h2 className="mt-1 text-base font-semibold tracking-tight">
              Heavy Rainfall Early-Warning Chain
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Trigger a live monsoon cloudburst and watch SlopeGuard monitor,
              analyse, predict, warn and respond in real time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="lg"
              onClick={simulateHeavyRainfall}
              disabled={simRunning}
              className="gap-2 bg-primary px-4 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {simRunning ? (
                <CloudRain className="size-4 animate-bounce" />
              ) : (
                <Zap className="size-4" />
              )}
              {simRunning ? 'Simulating…' : 'Simulate Heavy Rainfall'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={resetDemo}
              className="gap-2"
            >
              <RotateCcw className="size-4" />
              Reset Demo
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 p-4">
        {STEPS.map((step, i) => {
          const phase = i + 1
          const done = simPhase > phase
          const active = simPhase === phase
          return (
            <div key={step} className="flex items-center gap-1.5">
              <span
                className={cn(
                  'flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors',
                  done && 'border-risk-low/40 bg-risk-low/10 text-risk-low',
                  active && 'border-primary/50 bg-primary/15 text-primary',
                  !done && !active && 'border-border text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex size-4 items-center justify-center rounded-full text-[9px] font-bold',
                    done && 'bg-risk-low/25',
                    active && 'bg-primary/25 animate-pulse',
                    !done && !active && 'bg-secondary',
                  )}
                >
                  {done ? '✓' : phase}
                </span>
                {step}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className={cn(
                    'h-px w-3',
                    simPhase > phase ? 'bg-risk-low/50' : 'bg-border',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
