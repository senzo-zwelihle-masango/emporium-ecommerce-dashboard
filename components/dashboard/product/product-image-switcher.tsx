'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface ImageSwitcherProps {
  images: string[]
}

const ProductImageSwitcher = ({ images }: ImageSwitcherProps) => {
  // product images states
  const [imageIndex, setImageIndex] = useState(0)
  //   prevous image state
  const previousImage = () => {
    setImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }
  //   next image state
  const nextImage = () => {
    setImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }
  //   handle image click
  const handleImageClick = (index: number) => {
    setImageIndex(index)
  }

  return (
    <div className="lg:col-span-1">
      <Card>
        <CardContent className="p-2">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={images[imageIndex]}
                alt={'product image'}
                fill
                quality={95}
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <Button variant={'ghost'} size={'icon'} onClick={previousImage}>
                  <ChevronLeftIcon />
                </Button>
                <Button variant={'ghost'} size={'icon'} onClick={nextImage}>
                  <ChevronRightIcon />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <div
                  className={cn(
                    index === imageIndex ? 'border-primary border-2' : 'border border-gray-200',
                    'relative aspect-square overflow-hidden rounded-md'
                  )}
                  key={index}
                  onClick={() => handleImageClick(index)}
                >
                  <Image
                    src={image}
                    alt="Product Image"
                    fill
                    quality={95}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductImageSwitcher
