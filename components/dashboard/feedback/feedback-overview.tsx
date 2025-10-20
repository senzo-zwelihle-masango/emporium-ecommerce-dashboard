'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FeedbackOverviewProps {
  reviews: {
    total: number
    approved: number
    pending: number
    rejected: number
  }
  experiences: {
    total: number
    averageRating: number
  }
  recentFeedback: Array<{
    id: string
    type: 'review' | 'experience'
    user: string
    rating: number
    comment: string
    date: string
  }>
}

export function FeedbackOverview({ reviews, experiences, recentFeedback }: FeedbackOverviewProps) {
  // Prepare chart data
  const chartData = [
    { name: 'Approved', value: reviews.approved },
    { name: 'Pending', value: reviews.pending },
    { name: 'Rejected', value: reviews.rejected },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Product Reviews</CardTitle>
          <CardDescription>Total: {reviews.total} reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Approved</span>
              <Badge variant="secondary">{reviews.approved}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Pending</span>
              <Badge variant="outline">{reviews.pending}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Rejected</span>
              <Badge variant="destructive">{reviews.rejected}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experiences Summary */}
      <Card>
        <CardHeader>
          <CardTitle>User Experiences</CardTitle>
          <CardDescription>Total: {experiences.total} experiences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Average Rating</span>
              <Badge variant="secondary">{experiences.averageRating.toFixed(1)} / 5</Badge>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
          <CardDescription>Latest customer comments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{feedback.user}</p>
                    <p className="text-muted-foreground line-clamp-2 text-sm">{feedback.comment}</p>
                  </div>
                  <Badge variant={feedback.type === 'review' ? 'default' : 'secondary'}>
                    {feedback.rating} ★
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">{feedback.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
