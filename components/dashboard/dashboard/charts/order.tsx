'use client'

import React from 'react'
import { PieChart, Pie, Cell, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface OrderStatusData {
  status: string
  count: number
}

interface OrderStatusPieChartProps {
  data: OrderStatusData[]
}

const COLORS = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  packed: '#6366f1',
  shipped: '#f97316',
  outfordelivery: '#06b6d4',
  delivered: '#10b981',
  cancelled: '#ef4444',
  returned: '#6b7280',
}

const chartConfig: ChartConfig = {
  count: {
    label: 'Orders',
  },
}

const OrderChart = ({ data }: OrderStatusPieChartProps) => {
  const formattedData = data.map((item) => ({
    ...item,
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1).replace(/([A-Z])/g, ' $1'),
    fill: COLORS[item.status as keyof typeof COLORS] || '#64748b',
  }))
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status Distribution</CardTitle>
        <CardDescription>Current orders by status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[350px]">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="count"
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default OrderChart
