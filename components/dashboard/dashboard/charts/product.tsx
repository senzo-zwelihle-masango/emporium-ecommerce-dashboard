'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface ProductData {
  id: string
  name: string
  price: number
  sales: number
}

interface TopProductsLineChartProps {
  data: ProductData[]
}

const chartConfig: ChartConfig = {
  sales: {
    label: 'Units Sold',
    color: 'hsl(var(--ultramarine-600))',
  },
}

const ProductChart = ({ data }: TopProductsLineChartProps) => {
  const chartData = data.map((product, index) => ({
    name: product.name.length > 15 ? `${product.name.substring(0, 15)}...` : product.name,
    sales: product.sales,
    revenue: product.sales * product.price,
    rank: index + 1,
  }))
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products Performance</CardTitle>
        <CardDescription>Best selling products by units sold</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              className="text-xs"
              axisLine={false}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              className="text-sm"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              labelFormatter={(label) => `Product: ${label}`}
              formatter={(value) => [`${value} units`, 'Units Sold']}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="hsl(var(--ultramarine-600))"
              strokeWidth={3}
              dot={{
                fill: 'hsl(var(--ultramarine-600))',
                strokeWidth: 2,
                r: 6,
              }}
              activeDot={{
                r: 8,
                stroke: 'hsl(var(--ultramarine-600))',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>
        <div className="mt-4 space-y-2">
          {data.slice(0, 3).map((product, index) => (
            <div key={product.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="bg-ultramarine-100 text-ultramarine-700 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
                  {index + 1}
                </span>
                <span className="max-w-[200px] truncate">{product.name}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{product.sales} sold</div>
                <div className="text-muted-foreground text-xs">
                  R{product.price.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductChart
