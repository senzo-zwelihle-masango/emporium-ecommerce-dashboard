import React from 'react'


import NavigationMenu from '@/components/home/navigation-menu'
import FooterMenu from '@/components/home/footer-menu'

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <NavigationMenu />
      {children}
      <FooterMenu/>
    </main>
  )
}

export default StoreLayout
