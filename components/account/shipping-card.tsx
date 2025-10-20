import React from 'react'
import Link from 'next/link'

import {
  Building2Icon,
  BuildingIcon,
  FilePenIcon,
  GlobeIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
  Trash2Icon,
  TruckIcon,
  UserIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { Shipping } from '@/lib/generated/prisma'

const ShippingCard = ({ address }: { address: Shipping }) => {
  // shorten
  const formatProvince = (province: string) => {
    return province.replace(/([A-Z])/g, ' $1').trim()
  }
  return (
    <Card className="group border-border/50 hover:border-border relative transition-all duration-300 hover:shadow-lg">
      {address.isDefault && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="gap-1.5">
            <StarIcon className="h-3.5 w-3.5 fill-current" />
            Default
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {address.type === 'business' ? (
              <Building2Icon className="text-muted-foreground h-5 w-5" />
            ) : (
              <HomeIcon className="text-muted-foreground h-5 w-5" />
            )}
            <h3 className="text-lg font-semibold">{address.label}</h3>
          </div>
          <Badge variant="outline" className="text-xs font-medium">
            {address.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Full Name */}
        <div className="flex items-center gap-3">
          <UserIcon className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <p className="text-foreground font-medium">{address.fullName}</p>
        </div>

        {/* Street Address */}
        <div className="flex items-start gap-3">
          <MapPinIcon className="text-muted-foreground mt-1 h-4 w-4 flex-shrink-0" />
          <div className="text-muted-foreground text-sm leading-relaxed">
            <p className="text-foreground font-medium">{address.streetAddress}</p>
            {address.streetAddress2 && (
              <p className="text-muted-foreground">{address.streetAddress2}</p>
            )}
          </div>
        </div>

        {/* City and Suburb */}
        <div className="flex items-center gap-3">
          <BuildingIcon className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <p className="text-muted-foreground text-sm">
            {address.suburb}, {address.city}
          </p>
        </div>

        {/* Province and Postal Code */}
        <div className="flex items-center gap-3">
          <TruckIcon className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <p className="text-muted-foreground text-sm">
            {formatProvince(address.province)}, {address.postalCode}
          </p>
        </div>

        {/* Country */}
        {address.country && (
          <div className="flex items-center gap-3">
            <GlobeIcon className="text-muted-foreground h-4 w-4 flex-shrink-0" />
            <p className="text-muted-foreground text-sm">{address.country}</p>
          </div>
        )}

        {/* Phone Number */}
        <div className="flex items-center gap-3">
          <PhoneIcon className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <p className="text-muted-foreground text-sm">{address.phoneNumber}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Link href={`/account/shipping/${address.id}/update`} className="flex-1">
            <Button variant="outline" className="w-full">
              <FilePenIcon className="mr-2 size-4" />
              Update
            </Button>
          </Link>

          <Link href={`/account/shipping/${address.id}/delete`} className="flex-1">
            <Button variant="destructive" className="w-full">
              <Trash2Icon className="mr-2 size-4" />
              Delete
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default ShippingCard
