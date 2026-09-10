'use client'

import { useRef, useState } from 'react'
import { CheckCircle2, Send, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RiskBadge } from '@/components/risk-badge'
import { useDemo } from '@/lib/demo-context'
import { timeAgo } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ReportType, RiskLevel } from '@/lib/types'

const TYPES: ReportType[] = ['Ground crack', 'Landslide', 'Slope movement', 'Blocked road']
const SEVERITIES: RiskLevel[] = ['low', 'moderate', 'high', 'critical']

const CONFIRM_STEPS = [
  'Report received',
  'AI assessment completed',
  'Authorities notified',
]

export function FieldReportsView() {
  const { reports, addFieldReport } = useDemo()
  const [type, setType] = useState<ReportType>('Ground crack')
  const [severity, setSeverity] = useState<RiskLevel>('moderate')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [photoName, setPhotoName] = useState<string>()
  const [submitted, setSubmitted] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!location.trim()) return
    addFieldReport({
      type,
      location: location.trim(),
      severity,
      description: description.trim() || 'No additional detail provided.',
      photoName,
    })
    setSubmitted(true)
    setLocation('')
    setDescription('')
    setPhotoName(undefined)
    if (fileRef.current) fileRef.current.value = ''
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Submit Field Report</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Observation type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
                      type === t
                        ? 'border-primary/50 bg-primary/15 text-primary'
                        : 'border-border text-muted-foreground hover:bg-secondary',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="loc"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Location
              </label>
              <input
                id="loc"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. NH-10 near Rangpo, Sikkim"
                required
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Severity
              </label>
              <div className="grid grid-cols-4 gap-2">
                {SEVERITIES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    className={cn(
                      'rounded-lg border py-1.5 text-[11px] font-semibold uppercase transition-colors',
                      severity === s ? 'text-background' : 'text-muted-foreground',
                    )}
                    style={
                      severity === s
                        ? {
                            backgroundColor: `var(--risk-${s})`,
                            borderColor: `var(--risk-${s})`,
                          }
                        : { borderColor: 'var(--border)' }
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="desc"
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Description
              </label>
              <textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe what you observed…"
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Photo evidence
              </label>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center gap-2 rounded-lg border border-dashed border-input bg-background px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
              >
                <Upload className="size-4" />
                {photoName ?? 'Upload photo (optional)'}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setPhotoName(e.target.files?.[0]?.name)}
              />
            </div>

            <Button type="submit" size="lg" className="w-full gap-2 font-semibold">
              <Send className="size-4" />
              Submit Report
            </Button>

            {submitted && (
              <div className="animate-rise-in space-y-1.5 rounded-lg border border-risk-low/40 bg-risk-low/10 p-3">
                {CONFIRM_STEPS.map((s) => (
                  <p
                    key={s}
                    className="flex items-center gap-2 text-xs font-medium text-risk-low"
                  >
                    <CheckCircle2 className="size-3.5" />
                    {s}
                  </p>
                ))}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Ground Observations ({reports.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {reports.map((r) => (
            <div
              key={r.id}
              className="animate-rise-in rounded-lg border border-border bg-secondary/30 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{r.type}</p>
                  <p className="text-[11px] text-muted-foreground">{r.location}</p>
                </div>
                <RiskBadge level={r.severity} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{r.description}</p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1 text-risk-low">
                  <CheckCircle2 className="size-3" /> AI assessed · authorities notified
                </span>
                <span className="ml-auto">{timeAgo(r.time)}</span>
                {r.photoName && <span>· photo attached</span>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
