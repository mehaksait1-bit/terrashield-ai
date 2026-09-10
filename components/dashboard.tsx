'use client'

import { CriticalBanner } from '@/components/critical-banner'
import { Notifications } from '@/components/notifications'
import { MobileNav, Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import { AiPredictionView } from '@/components/views/ai-prediction'
import { AlertsView } from '@/components/views/alerts'
import { AnalyticsView } from '@/components/views/analytics'
import { FieldReportsView } from '@/components/views/field-reports'
import { LiveMapView } from '@/components/views/live-map'
import { OverviewView } from '@/components/views/overview'
import { useDemo } from '@/lib/demo-context'

export function Dashboard() {
  const { activeView } = useDemo()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <MobileNav />
        <main className="flex-1 p-4 md:p-6">
          {activeView === 'overview' && <OverviewView />}
          {activeView === 'map' && <LiveMapView />}
          {activeView === 'prediction' && <AiPredictionView />}
          {activeView === 'reports' && <FieldReportsView />}
          {activeView === 'alerts' && <AlertsView />}
          {activeView === 'analytics' && <AnalyticsView />}
        </main>
      </div>
      <Notifications />
      <CriticalBanner />
    </div>
  )
}
