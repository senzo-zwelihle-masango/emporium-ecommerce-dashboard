'use client'

import React from 'react'
import Link from 'next/link'

import { useScroll } from 'motion/react'

import { Menu, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import ElysianEmporiumLogo from '@/components/ui/emporium-ecommerce-svg'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'

import { menuItems } from '@/data/constants/navigation-items'

import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'
import NotificationMenu from '../notification/notification-menu'
import UserDropdown from '../user/user-dropdown'

const NavigationMenu = () => {
  const { data: session, isPending } = authClient.useSession()
  const [menuState, setMenuState] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  const { scrollYProgress } = useScroll()

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrolled(latest > 0.05)
    })
    return () => unsubscribe()
  }, [scrollYProgress])
  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className={cn(
          'fixed z-20 w-full transition-colors duration-150',
          scrolled && 'bg-background/50 backdrop-blur-3xl'
        )}
      >
        <div className="mx-auto px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <ElysianEmporiumLogo className="size-9 rounded-md" />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="m-auto size-6 duration-200 in-data-[state=active]:scale-0 in-data-[state=active]:rotate-180 in-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-6 scale-0 -rotate-180 opacity-0 duration-200 in-data-[state=active]:scale-100 in-data-[state=active]:rotate-0 in-data-[state=active]:opacity-100" />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link href={item.href} className="block duration-150">
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-background mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 in-data-[state=active]:block md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:in-data-[state=active]:flex dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link href={item.href} className="block duration-150">
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <ThemeSwitcher />
                {session ? (
                  <>
                    <NotificationMenu />

                    <UserDropdown
                      email={session.user.email}
                      image={
                        session?.user.image ?? `https://avatar.vercel.sh/${session?.user.email}`
                      }
                      name={
                        session?.user.name && session.user.name.length > 0
                          ? session.user.name
                          : session?.user.email.split('@')[0]
                      }
                    />
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline">
                      <Link href="/sign-in">
                        <span>Sign In</span>
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/sign-up">
                        <span>Sign Up</span>
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default NavigationMenu
