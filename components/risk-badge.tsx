import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { riskBadge, riskLabel } from '@/lib/risk'
import type { RiskLevel } from '@/lib/types'

export function RiskBadge({
  level,
  className,
  label,
}: {
  level: RiskLevel
  className?: string
  label?: string
}) {
  return (
    <Badge className={cn(riskBadge[level], 'uppercase tracking-wide', className)}>
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: `var(--risk-${level})` }}
        aria-hidden
      />
      {label ?? riskLabel[level]}
    </Badge>
  )
}
