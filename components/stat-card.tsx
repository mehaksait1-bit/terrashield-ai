import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  sub,
  accent,
  className,
}: {
  icon: LucideIcon
  label: string
  value: string | number
  unit?: string
  sub?: string
  accent?: string
  className?: string
}) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span
          className="flex size-8 items-center justify-center rounded-lg"
          style={{
            backgroundColor: accent
              ? `color-mix(in oklch, ${accent} 16%, transparent)`
              : 'var(--secondary)',
            color: accent ?? 'var(--muted-foreground)',
          }}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span
          className="font-mono text-2xl font-semibold tabular-nums"
          style={accent ? { color: accent } : undefined}
        >
          {value}
        </span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
      {sub && <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>}
    </Card>
  )
}
