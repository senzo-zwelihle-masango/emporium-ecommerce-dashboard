'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  EyeIcon,
  FilterIcon,
  GridIcon,
  HeartIcon,
  ListIcon,
  ShareIcon,
  ShoppingCartIcon,
  StarIcon,
  XIcon,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { UserAccountData } from '@/types/user/account/data'

interface FavoritesTabProps {
  favorites: UserAccountData['favorites']
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount)
}

const FavoriteCard = ({ favorite }: { favorite: UserAccountData['favorites'][0] }) => {
  const { product } = favorite

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Remove from favorites button */}
      <Button
        variant="ghost"
        size="sm"
        className="bg-background/80 hover:bg-destructive hover:text-destructive-foreground absolute top-2 right-2 z-10 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
      >
        <XIcon />
      </Button>

      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-xl">
          <Avatar className="h-full w-full rounded-none">
            <AvatarImage
              src={product.images[0] || '/placeholder-product.jpg'}
              alt={product.name}
              className="object-cover transition-transform duration-200 hover:scale-105"
            />
            <AvatarFallback className="rounded-none text-2xl">{product.name[0]}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-4">
        <div className="space-y-1">
          <CardTitle className="line-clamp-2 text-lg leading-tight">{product.name}</CardTitle>
          <CardDescription className="text-xs">
            Added {formatDistanceToNow(favorite.createdAt, { addSuffix: true })}
          </CardDescription>
        </div>

        {/* Rating - Using default rating since no rating field */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`size-4 ${star <= 5 ? 'fill-yellow-400 text-yellow-400' : ''}`}
              />
            ))}
          </div>
          <span className="text-muted-foreground text-sm">(5.0)</span>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{formatCurrency(Number(product.price))}</span>
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </Badge>
          {product.stock > 0 && product.stock <= 5 && (
            <Badge variant="outline" className="border-orange-600 text-orange-600">
              Only {product.stock} left
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1" disabled={product.stock === 0}>
            <ShoppingCartIcon />
            Add to Cart
          </Button>
          <Button variant="outline" size="icon">
            <EyeIcon />
          </Button>
          <Button variant="outline" size="icon">
            <ShareIcon />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export const FavoritesTab = ({ favorites }: FavoritesTabProps) => {
  // Calculate favorites statistics
  const totalValue = favorites.reduce((sum, fav) => sum + Number(fav.product.price), 0)
  const availableItems = favorites.filter((fav) => fav.product.stock > 0).length
  const averagePrice = favorites.length > 0 ? totalValue / favorites.length : 0

  if (favorites.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-16">
          <div>
            <HeartIcon />
          </div>
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold">No favorites yet</h3>
            <p className="mx-auto max-w-sm">
              Save products you love! Favorited items will appear here for easy access.
            </p>
          </div>
          <Button className="mt-4">
            <HeartIcon />
            Browse Products
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Favorites Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Favorites</CardTitle>
            <HeartIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favorites.length}</div>
            <p className="text-xs">Products saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <ShoppingCartIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableItems}</div>
            <p className="text-xs">In stock items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <StarIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs">Combined value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <FilterIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averagePrice)}</div>
            <p className="text-xs">Per item</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Your Favorites</h3>
          <Badge variant="secondary">{favorites.length}</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FilterIcon />
            Filter
          </Button>
          <div className="flex rounded-md border p-1">
            <Button variant="ghost" size="sm" className="p-1">
              <GridIcon />
            </Button>
            <Button variant="ghost" size="sm" className="p-1">
              <ListIcon />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="space-y-1">
            <h4 className="font-semibold">Bulk Actions</h4>
            <p className="text-sm">Manage multiple favorites at once</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={availableItems === 0}>
              <ShoppingCartIcon />
              Add All to Cart ({availableItems})
            </Button>
            <Button variant="outline" size="sm">
              <ShareIcon />
              Share Wishlist
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Favorites Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favorites
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map((favorite) => (
            <FavoriteCard key={favorite.id} favorite={favorite} />
          ))}
      </div>
    </div>
  )
}
