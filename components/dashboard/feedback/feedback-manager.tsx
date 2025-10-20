'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  Star,
  User,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Flag,
  Archive,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ExperienceStatus, ReviewStatus } from '@/lib/generated/prisma'

interface User {
  id: string
  name: string
  email: string
  image: string | null
}

interface Product {
  id: string
  name: string
  images?: string[]
  brand?: {
    name: string
  }
}

interface Review {
  id: string
  userId: string
  user: User
  productId: string
  product: Product
  rating: number
  comment: string
  status: ReviewStatus
  createdAt: Date
  updatedAt: Date
}

interface Experience {
  id: string
  userId: string
  user: User
  rating: number
  comment: string | null
  status: ExperienceStatus
  createdAt: Date
  updatedAt: Date
}

interface FeedbackManagerProps {
  type: 'review' | 'experience'
  item: Review | Experience
  onUpdateStatus: (id: string, status: string) => void
  onDelete: (id: string) => void
}

export function FeedbackManager({ type, item, onUpdateStatus, onDelete }: FeedbackManagerProps) {
  const [reply, setReply] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStatusUpdate = (status: string) => {
    onUpdateStatus(item.id, status)
  }

  const handleReplySubmit = async () => {
    if (!reply.trim()) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setReply('')
    }, 1000)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Feedback Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{type === 'review' ? 'Product Review' : 'User Experience'}</CardTitle>
              <Badge
                variant={
                  item.status === 'approved'
                    ? 'default'
                    : item.status === 'pending'
                      ? 'secondary'
                      : item.status === 'rejected'
                        ? 'destructive'
                        : 'outline'
                }
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
            </div>
            <CardDescription>
              Submitted on {new Date(item.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  {item.user.image ? (
                    <AvatarImage src={item.user.image} alt={item.user.name} />
                  ) : (
                    <AvatarFallback>{item.user.name?.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-semibold">{item.user.name}</h3>
                  <p className="text-muted-foreground text-sm">{item.user.email}</p>
                </div>
              </div>

              <Separator />

              {/* Product Info (for reviews only) */}
              {type === 'review' && (item as Review).product && (
                <div className="space-y-4">
                  <h4 className="font-medium">Product Details</h4>
                  <div className="flex items-center gap-4">
                    {(item as Review).product.images?.[0] && (
                      <div className="relative h-16 w-16 overflow-hidden rounded-md">
                        <Image
                          src={(item as Review).product.images![0]}
                          alt={(item as Review).product.name}
                          width={16}
                          height={16}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">{(item as Review).product.name}</h4>
                      <p className="text-muted-foreground text-sm">
                        {(item as Review).product.brand?.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Rating */}
              <div className="space-y-2">
                <h4 className="font-medium">Rating</h4>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < item.rating
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-medium">{item.rating}/5</span>
                </div>
              </div>

              <Separator />

              {/* Comment */}
              <div className="space-y-2">
                <h4 className="font-medium">Comment</h4>
                <p className="whitespace-pre-wrap">{item.comment || 'No comment provided'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reply Section */}
        <Card>
          <CardHeader>
            <CardTitle>Send Reply</CardTitle>
            <CardDescription>Respond to the customer&apos;s feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reply">Your Response</Label>
                <Textarea
                  id="reply"
                  placeholder="Write your response to the customer..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleReplySubmit} disabled={isSubmitting || !reply.trim()}>
                {isSubmitting ? 'Sending...' : 'Send Reply'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleStatusUpdate('approved')}
              disabled={item.status === 'approved'}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleStatusUpdate('rejected')}
              disabled={item.status === 'rejected'}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleStatusUpdate('flagged')}
              disabled={item.status === 'flagged'}
            >
              <Flag className="mr-2 h-4 w-4" />
              Flag
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleStatusUpdate('archived')}
              disabled={item.status === 'archived'}
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
            <Separator className="my-2" />
            <Button className="w-full" variant="destructive" onClick={() => onDelete(item.id)}>
              Delete Feedback
            </Button>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-muted-foreground text-sm">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-sm font-medium">Updated</p>
                <p className="text-muted-foreground text-sm">
                  {new Date(item.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
            {item.comment && (
              <div className="flex items-center gap-3">
                <MessageSquare className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Comment Length</p>
                  <p className="text-muted-foreground text-sm">{item.comment.length} characters</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
