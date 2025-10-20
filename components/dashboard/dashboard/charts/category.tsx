'use client'

import React from 'react'
import { RadialBarChart, RadialBar, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'

interface CategoryData {
  name: string
  sales: number
}

interface CategoryRadialChartProps {
  data: CategoryData[]
}

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

const chartConfig: ChartConfig = {
  sales: {
    label: 'Sales',
  },
}

const CategoryChart = ({ data }: CategoryRadialChartProps) => {
  const maxSales = Math.max(...data.map((item) => item.sales))

  const formattedData = data.slice(0, 5).map((item, index) => ({
    name: item.name,
    sales: item.sales,
    fill: COLORS[index % COLORS.length],
    percentage: Math.round((item.sales / maxSales) * 100),
  }))
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Performance</CardTitle>
        <CardDescription>Top 5 categories by sales volume</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[350px]">
          <RadialBarChart
            data={formattedData}
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="90%"
            startAngle={90}
            endAngle={450}
            barSize={40}
          >
            <RadialBar dataKey="percentage" cornerRadius={5} />
            <Legend
              iconSize={8}
              wrapperStyle={
                {
                  fontSize: '12px',
                  paddingTop: '10px',
                } as React.CSSProperties
              }
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="mt-4 space-y-2">
          {formattedData.map((category) => (
            <div key={category.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.fill }} />
                <span>{category.name}</span>
              </div>
              <span className="font-medium">R{category.sales.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default CategoryChart
