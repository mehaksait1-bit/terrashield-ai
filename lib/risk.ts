import type { RiskLevel } from './types'

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 40) return 'moderate'
  return 'low'
}

export const riskLabel: Record<RiskLevel, string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  critical: 'Critical',
}

/** Tailwind text color class per risk level */
export const riskText: Record<RiskLevel, string> = {
  low: 'text-risk-low',
  moderate: 'text-risk-moderate',
  high: 'text-risk-high',
  critical: 'text-risk-critical',
}

/** CSS var color per level for charts / inline styles */
export const riskColorVar: Record<RiskLevel, string> = {
  low: 'var(--risk-low)',
  moderate: 'var(--risk-moderate)',
  high: 'var(--risk-high)',
  critical: 'var(--risk-critical)',
}

/** Soft badge classes per level */
export const riskBadge: Record<RiskLevel, string> = {
  low: 'bg-risk-low/15 text-risk-low border-risk-low/30',
  moderate: 'bg-risk-moderate/15 text-risk-moderate border-risk-moderate/30',
  high: 'bg-risk-high/15 text-risk-high border-risk-high/30',
  critical: 'bg-risk-critical/15 text-risk-critical border-risk-critical/30',
}

export function riskColor(score: number): string {
  return riskColorVar[getRiskLevel(score)]
}
