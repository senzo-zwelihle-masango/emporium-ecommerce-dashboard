'use client'

import React from 'react'
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface RevenueData {
  month: string
  revenue: number
}

interface RevenueAreaChartProps {
  data: RevenueData[]
}

const chartConfig: ChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--ultramarine-500))',
  },
}

const RevenueChart = ({ data }: RevenueAreaChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue for the last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-sm" axisLine={false} tickLine={false} />
            <YAxis
              className="text-sm"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--ultramarine-500))"
              fill="hsl(var(--ultramarine-500))"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default RevenueChart
