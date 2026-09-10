export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical'

export type ViewId =
  | 'overview'
  | 'map'
  | 'prediction'
  | 'reports'
  | 'alerts'
  | 'analytics'

export interface District {
  id: string
  name: string
  state: string
  /** stylized map coordinates as percentages (0-100) */
  x: number
  y: number
  riskScore: number
  rainfall: number // mm / 24h
  soilMoisture: number // percent saturation
  slopeAngle: number // degrees
  historicalLandslides: number
  population: number
  vulnerableRoads: number
  vulnerableVillages: number
}

export interface Alert {
  id: string
  level: RiskLevel
  location: string
  riskScore: number
  cause: string
  action: string
  time: number // epoch ms
}

export type ReportType =
  | 'Ground crack'
  | 'Landslide'
  | 'Slope movement'
  | 'Blocked road'

export interface FieldReport {
  id: string
  type: ReportType
  location: string
  severity: RiskLevel
  description: string
  photoName?: string
  time: number
  // stylized map coordinates
  x: number
  y: number
}

export interface AiResult {
  riskScore: number
  confidence: number
  level: RiskLevel
  factors: string[]
  action: string
  summary: string
}

export interface AppNotification {
  id: string
  level: RiskLevel | 'info'
  title: string
  message: string
}
