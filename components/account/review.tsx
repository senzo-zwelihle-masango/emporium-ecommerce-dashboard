'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  EditIcon,
  EyeIcon,
  MessageSquareIcon,
  StarIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { UserAccountData } from '@/types/user/account/data'

interface ReviewsTabProps {
  reviews: UserAccountData['reviews']
}

const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : ''
          }`}
        />
      ))}
    </div>
  )
}

const ReviewCard = ({ review }: { review: UserAccountData['reviews'][0] }) => {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-md">
            <AvatarImage
              src={review.product.images[0] || '/placeholder-product.jpg'}
              alt={review.product.name}
              className="object-cover"
            />
            <AvatarFallback className="rounded-md text-lg">{review.product.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div>
              <CardTitle className="text-lg leading-tight">{review.product.name}</CardTitle>
              <CardDescription>
                Reviewed {formatDistanceToNow(review.createdAt, { addSuffix: true })}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="md" />
              <Badge variant="secondary">{review.rating}/5</Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Review Content */}
        <div className="space-y-2">
          {review.comment && (
            <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
          )}
        </div>

        {/* Review Stats */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <EyeIcon className="h-4 w-4" />
              <span>Status: {review.status}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <EditIcon className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              <Trash2Icon className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const ReviewsTab = ({ reviews }: ReviewsTabProps) => {
  // Calculate review statistics
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

  const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
  }))

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-16">
          <div>
            <MessageSquareIcon />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold">No reviews yet</h3>
            <p className="mx-auto max-w-sm">
              Share your experience! Write reviews for products you&apos;ve purchased to help other
              customers.
            </p>
          </div>
          <Button className="mt-4">
            <StarIcon />
            Browse Orders
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Review Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquareIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews.length}</div>
            <p className="text-muted-foreground text-xs">Products reviewed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <StarIcon />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-2xl font-bold">
              {averageRating.toFixed(1)}
              <StarRating rating={Math.round(averageRating)} size="sm" />
            </div>
            <p className="text-muted-foreground text-xs">Your average score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Reviews</CardTitle>
            <ThumbsUpIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews.filter((review) => review.status === 'approved').length}
            </div>
            <p className="text-muted-foreground text-xs">Live on products</p>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StarIcon />
            Rating Distribution
          </CardTitle>
          <CardDescription>Your review ratings breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ratingDistribution.reverse().map(({ rating, count }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex w-16 items-center gap-1">
                  <span className="text-sm font-medium">{rating}</span>
                  <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="bg-secondary h-2 flex-1 rounded-full">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%',
                    }}
                  />
                </div>
                <span className="text-muted-foreground w-8 text-right text-sm">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Reviews</h3>
          <Badge variant="secondary">{reviews.length}</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {reviews
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
        </div>
      </div>
    </div>
  )
}
