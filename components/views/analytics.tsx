'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useDemo } from '@/lib/demo-context'
import {
  incidentTypes,
  rainfallVsRisk,
  roadConnectivity,
  sevenDayTrend,
} from '@/lib/data'
import { getRiskLevel } from '@/lib/risk'

const axis = {
  stroke: 'var(--muted-foreground)',
  fontSize: 11,
  tickLine: false,
  axisLine: false,
}
const tooltipStyle = {
  contentStyle: {
    background: 'var(--popover)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    fontSize: 12,
    color: 'var(--popover-foreground)',
  },
  labelStyle: { color: 'var(--muted-foreground)' },
  cursor: { fill: 'var(--secondary)', opacity: 0.3 },
}

const CONNECTIVITY_COLORS = ['var(--risk-low)', 'var(--risk-high)', 'var(--risk-critical)']

export function AnalyticsView() {
  const { districts } = useDemo()
  const distribution = [...districts]
    .map((d) => ({ name: d.state.split(' ')[0], risk: d.riskScore }))
    .sort((a, b) => b.risk - a.risk)

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Rainfall vs Landslide Risk</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: -12 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="rainfall"
                name="Rainfall"
                unit="mm"
                {...axis}
              />
              <YAxis type="number" dataKey="risk" name="Risk" {...axis} />
              <Tooltip {...tooltipStyle} />
              <Scatter data={rainfallVsRisk} fill="var(--primary)" line={{ stroke: 'var(--primary)', strokeWidth: 1 }} />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7-Day Regional Risk Trend</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={sevenDayTrend} margin={{ top: 8, right: 8, bottom: 8, left: -12 }}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="day" {...axis} />
              <YAxis {...axis} />
              <Tooltip {...tooltipStyle} />
              <Area
                type="monotone"
                dataKey="risk"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#riskGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>District Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={distribution} margin={{ top: 8, right: 8, bottom: 8, left: -12 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" {...axis} interval={0} angle={-15} textAnchor="end" height={44} />
              <YAxis {...axis} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
                {distribution.map((d) => (
                  <Cell key={d.name} fill={`var(--risk-${getRiskLevel(d.risk)})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Road Connectivity Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={roadConnectivity}
                dataKey="value"
                nameKey="status"
                innerRadius={54}
                outerRadius={84}
                paddingAngle={3}
                stroke="var(--card)"
                strokeWidth={2}
              >
                {roadConnectivity.map((entry, i) => (
                  <Cell key={entry.status} fill={CONNECTIVITY_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4">
            {roadConnectivity.map((r, i) => (
              <span key={r.status} className="flex items-center gap-1.5 text-xs">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: CONNECTIVITY_COLORS[i] }}
                />
                {r.status} <span className="text-muted-foreground">{r.value}%</span>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Incident Types (last 90 days)</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={incidentTypes}
              layout="vertical"
              margin={{ top: 8, right: 16, bottom: 8, left: 24 }}
            >
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" {...axis} />
              <YAxis type="category" dataKey="type" {...axis} width={110} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
