import React from 'react'
import Link from 'next/link'

import ElysianEmporiumLogo from '@/components/ui/emporium-ecommerce-logo'

import { menuItems } from '@/data/constants/navigation-items'

const FooterMenu = () => {
  return (
    <footer className="bg-background border-b py-12">
      <div className="mx-auto px-6">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="order-last flex items-center gap-3 md:order-first">
            <Link href="/" aria-label="go home">
                <ElysianEmporiumLogo className='size-9 rounded-md'/>
            </Link>
            <span className="text-muted-foreground block text-center text-sm">
              © {new Date().getFullYear()} Tailark Mist, All rights reserved
            </span>
          </div>

          <div className="order-first flex flex-wrap gap-x-6 gap-y-4 md:order-last">
            {menuItems.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-primary block duration-150"
              >
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterMenu
