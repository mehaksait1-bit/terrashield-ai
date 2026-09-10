'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  initialAlerts,
  initialDistricts,
  initialReports,
} from './data'
import { getRiskLevel } from './risk'
import type {
  Alert,
  AiResult,
  AppNotification,
  District,
  FieldReport,
  ReportType,
  RiskLevel,
  ViewId,
} from './types'

export interface AiInputs {
  rainfall: number
  soilMoisture: number
  slopeAngle: number
  historicalLandslides: number
}

interface DemoContextValue {
  districts: District[]
  alerts: Alert[]
  reports: FieldReport[]
  notifications: AppNotification[]
  activeView: ViewId
  setActiveView: (v: ViewId) => void
  focusDistrictId: string
  aiResult: AiResult | null
  aiAnalyzing: boolean
  simRunning: boolean
  simPhase: number
  criticalWarning: boolean
  dismissCriticalWarning: () => void
  regionalRisk: number
  peakRisk: number
  activeAlertCount: number
  runAiAnalysis: (inputs: AiInputs, districtId?: string) => void
  simulateHeavyRainfall: () => void
  resetDemo: () => void
  addFieldReport: (data: {
    type: ReportType
    location: string
    severity: RiskLevel
    description: string
    photoName?: string
  }) => void
  dismissNotification: (id: string) => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

const FOCUS_ID = 'sikkim'

export function computeScore(i: AiInputs): number {
  const score =
    (i.rainfall / 150) * 38 +
    (i.soilMoisture / 100) * 30 +
    (i.slopeAngle / 60) * 18 +
    (i.historicalLandslides / 60) * 14
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function buildAiResult(i: AiInputs): AiResult {
  const riskScore = computeScore(i)
  const level = getRiskLevel(riskScore)
  const factors: string[] = []
  if (i.rainfall >= 90) factors.push(`Intense rainfall (${Math.round(i.rainfall)} mm/24h)`)
  else if (i.rainfall >= 60) factors.push(`Elevated rainfall (${Math.round(i.rainfall)} mm/24h)`)
  if (i.soilMoisture >= 75) factors.push(`Saturated soil (${Math.round(i.soilMoisture)}%)`)
  else if (i.soilMoisture >= 55) factors.push(`High soil moisture (${Math.round(i.soilMoisture)}%)`)
  if (i.slopeAngle >= 35) factors.push(`Steep terrain (${Math.round(i.slopeAngle)}°)`)
  if (i.historicalLandslides >= 40) factors.push('Dense historical landslide record')
  if (factors.length === 0) factors.push('Stable conditions across all indicators')

  const action =
    level === 'critical'
      ? 'Immediate field inspection and evacuation of exposed villages recommended.'
      : level === 'high'
        ? 'Pre-position response teams and issue traveller advisory on affected corridors.'
        : level === 'moderate'
          ? 'Increase sensor polling frequency and alert district authorities.'
          : 'Continue routine monitoring; no action required.'

  const short = factors
    .map((f) => f.split(' (')[0].toLowerCase())
    .slice(0, 3)
    .join(' + ')
  const summary =
    level === 'low'
      ? 'Indicators within safe operating range across the region.'
      : `${short.charAt(0).toUpperCase()}${short.slice(1)} detected.`

  // confidence rises with signal extremity
  const extremity =
    Math.abs(i.rainfall - 75) / 75 +
    Math.abs(i.soilMoisture - 50) / 50
  const confidence = Math.min(98, Math.round(84 + extremity * 6))

  return { riskScore, confidence, level, factors, action, summary }
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [districts, setDistricts] = useState<District[]>(initialDistricts)
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [reports, setReports] = useState<FieldReport[]>(initialReports)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [activeView, setActiveView] = useState<ViewId>('overview')
  const [aiResult, setAiResult] = useState<AiResult | null>(null)
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [simRunning, setSimRunning] = useState(false)
  const [simPhase, setSimPhase] = useState(0)
  const [criticalWarning, setCriticalWarning] = useState(false)

  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout)
    }
  }, [])

  const pushNotification = useCallback((n: Omit<AppNotification, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setNotifications((prev) => [...prev, { ...n, id }])
    const t = setTimeout(() => {
      setNotifications((prev) => prev.filter((x) => x.id !== id))
    }, 6000)
    timers.current.push(t)
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const runAiAnalysis = useCallback(
    (inputs: AiInputs) => {
      setAiAnalyzing(true)
      setAiResult(null)
      const t = setTimeout(() => {
        const result = buildAiResult(inputs)
        setAiResult(result)
        setAiAnalyzing(false)
        pushNotification({
          level: result.level,
          title: 'AI analysis complete',
          message: `Predicted risk ${result.riskScore}/100 — ${result.level.toUpperCase()} (${result.confidence}% confidence)`,
        })
      }, 1600)
      timers.current.push(t)
    },
    [pushNotification],
  )

  const addFieldReport = useCallback<DemoContextValue['addFieldReport']>(
    (data) => {
      const report: FieldReport = {
        ...data,
        id: Math.random().toString(36).slice(2),
        time: Date.now(),
        x: 40 + Math.random() * 30,
        y: 40 + Math.random() * 30,
      }
      setReports((prev) => [report, ...prev])
      pushNotification({
        level: data.severity,
        title: 'Field report received',
        message: `${data.type} at ${data.location} — AI assessment complete, authorities notified.`,
      })
    },
    [pushNotification],
  )

  const simulateHeavyRainfall = useCallback(() => {
    // reset before running for a clean run
    timers.current.forEach(clearTimeout)
    timers.current = []
    setDistricts(initialDistricts)
    setCriticalWarning(false)
    setSimRunning(true)
    setSimPhase(1)
    setActiveView('overview')

    const schedule = (delay: number, fn: () => void) => {
      timers.current.push(setTimeout(fn, delay))
    }

    // Phase 1 — rainfall surge
    schedule(200, () => {
      setDistricts((prev) =>
        prev.map((d) => ({
          ...d,
          rainfall: Math.min(180, d.rainfall + (d.id === FOCUS_ID ? 57 : 40 + Math.random() * 20)),
        })),
      )
      pushNotification({
        level: 'info',
        title: 'Rainfall surge detected',
        message: 'IMD nowcast: intense convective rainfall over the Eastern Himalaya.',
      })
    })

    // Phase 2 — soil saturation
    schedule(1500, () => {
      setSimPhase(2)
      setDistricts((prev) =>
        prev.map((d) => ({
          ...d,
          soilMoisture: Math.min(99, d.soilMoisture + (d.id === FOCUS_ID ? 33 : 22 + Math.random() * 8)),
        })),
      )
      pushNotification({
        level: 'high',
        title: 'Soil moisture rising',
        message: 'Slopes approaching saturation across Sikkim and Meghalaya.',
      })
    })

    // Phase 3 — AI re-analysis
    schedule(3000, () => {
      setSimPhase(3)
      setAiAnalyzing(true)
      setAiResult(null)
    })

    // Phase 4 — risk scores climb, AI result lands
    schedule(4600, () => {
      setSimPhase(4)
      setAiAnalyzing(false)
      setDistricts((prev) =>
        prev.map((d) => {
          if (d.id === FOCUS_ID) return { ...d, riskScore: 89 }
          const bumped = Math.min(
            96,
            Math.round(d.riskScore + 18 + Math.random() * 12),
          )
          return { ...d, riskScore: bumped }
        }),
      )
      setAiResult({
        riskScore: 89,
        confidence: 94,
        level: 'critical',
        factors: [
          'Intense rainfall (145 mm/24h)',
          'Saturated soil (94%)',
          'Steep terrain (38°)',
          'Dense historical landslide record',
        ],
        action:
          'Immediate field inspection and evacuation of exposed villages recommended.',
        summary: 'High rainfall + saturated soil + steep terrain detected.',
      })
    })

    // Phase 5 — map critical (visual only, driven by scores above)
    schedule(5200, () => {
      setSimPhase(5)
    })

    // Phase 6 — alert generated
    schedule(6000, () => {
      setSimPhase(6)
      setAlerts((prev) => [
        {
          id: Math.random().toString(36).slice(2),
          level: 'critical',
          location: 'Mangan / North Sikkim',
          riskScore: 89,
          cause:
            'High rainfall + saturated soil + steep terrain — imminent slope failure risk',
          action:
            'Immediate field inspection and evacuation of exposed villages recommended.',
          time: Date.now(),
        },
        ...prev,
      ])
    })

    // Phase 7 — emergency priority updated + critical warning
    schedule(6800, () => {
      setSimPhase(7)
      setSimRunning(false)
      setCriticalWarning(true)
      pushNotification({
        level: 'critical',
        title: 'CRITICAL early warning generated',
        message: 'Mangan / North Sikkim escalated 54 → 89. Immediate field inspection recommended.',
      })
    })
  }, [pushNotification])

  const resetDemo = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setDistricts(initialDistricts)
    setAlerts(initialAlerts)
    setReports(initialReports)
    setNotifications([])
    setAiResult(null)
    setAiAnalyzing(false)
    setSimRunning(false)
    setSimPhase(0)
    setCriticalWarning(false)
  }, [])

  const regionalRisk = useMemo(
    () => Math.round(districts.reduce((s, d) => s + d.riskScore, 0) / districts.length),
    [districts],
  )
  const peakRisk = useMemo(
    () => districts.reduce((m, d) => Math.max(m, d.riskScore), 0),
    [districts],
  )
  const activeAlertCount = useMemo(
    () => alerts.filter((a) => a.level === 'high' || a.level === 'critical').length,
    [alerts],
  )

  const value: DemoContextValue = {
    districts,
    alerts,
    reports,
    notifications,
    activeView,
    setActiveView,
    focusDistrictId: FOCUS_ID,
    aiResult,
    aiAnalyzing,
    simRunning,
    simPhase,
    criticalWarning,
    dismissCriticalWarning: () => setCriticalWarning(false),
    regionalRisk,
    peakRisk,
    activeAlertCount,
    runAiAnalysis,
    simulateHeavyRainfall,
    resetDemo,
    addFieldReport,
    dismissNotification,
  }

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}
