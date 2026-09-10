'use client'

import {
  BarChart3,
  Bell,
  Brain,
  FileText,
  LayoutDashboard,
  Map,
  Mountain,
} from 'lucide-react'
import { useDemo } from '@/lib/demo-context'
import { cn } from '@/lib/utils'
import type { ViewId } from '@/lib/types'

const NAV: { id: ViewId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'map', label: 'Live Risk Map', icon: Map },
  { id: 'prediction', label: 'AI Prediction', icon: Brain },
  { id: 'reports', label: 'Field Reports', icon: FileText },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

export function Sidebar() {
  const { activeView, setActiveView, activeAlertCount, reports } = useDemo()

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Mountain className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">SlopeGuard NER</p>
          <p className="text-[11px] text-muted-foreground">Landslide Early Warning</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activeView === id
          const badge =
            id === 'alerts' ? activeAlertCount : id === 'reports' ? reports.length : 0
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveView(id)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {badge > 0 && (
                <span
                  className={cn(
                    'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold',
                    id === 'alerts'
                      ? 'bg-risk-critical/20 text-risk-critical'
                      : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border px-5 py-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Data sources
        </p>
        <ul className="mt-2 space-y-1.5 text-[11px] text-muted-foreground">
          <li className="flex items-center justify-between">
            <span>IMD Rainfall</span>
            <span className="text-risk-low">simulated</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Satellite / InSAR</span>
            <span className="text-risk-low">simulated</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Ground sensors</span>
            <span className="text-risk-low">simulated</span>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const { activeView, setActiveView } = useDemo()
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border bg-sidebar px-2 py-2 lg:hidden">
      {NAV.map(({ id, label, icon: Icon }) => {
        const active = activeView === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => setActiveView(id)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              active
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:bg-sidebar-accent',
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
