'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { LayoutDashboardIcon } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'

const NavigationHeader = () => {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const getHref = (index: number) => {
    return '/' + segments.slice(0, index + 1).join('/')
  }

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <div className="flex w-full items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  <LayoutDashboardIcon className="size-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              {segments.map((segment, index) => {
                const href = getHref(index)
                const isLast = index === segments.length - 1
                const label = decodeURIComponent(segment).replace(/-/g, ' ')

                return (
                  <span key={href} className="flex items-center">
                    <BreadcrumbSeparator className="mx-4 hidden md:block" />

                    <BreadcrumbItem
                      className={index < segments.length - 1 ? 'hidden md:block' : ''}
                    >
                      {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={href}>{label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </span>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>

          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}

export default NavigationHeader
