'use client'

import React from 'react'
import { Container } from '@/components/ui/container'
import { AnimatedGroup } from '../ui/animated-group'
import Image from 'next/image'
import Link from 'next/link'
import { TextEffect } from '../ui/text-effect'
import { Button } from '../ui/button'
import { Spotlight } from '../ui/spotlight'
import { authClient } from '@/lib/auth-client'

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring' as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

const Hero = () => {
  const { data: session, isPending } = authClient.useSession()
  return (
    <Container
      size="2xl"
      alignment="none"
      height="full"
      padding="px-sm"
      gap="none"
      flow="none"
      id="hero"
      className="overflow-hidden"
    >
      <Spotlight />
      <section>
        <div className="relative pt-24 md:pt-36">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
          />

          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:mx-auto lg:mt-0 lg:mr-auto">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="mx-auto mt-8 max-w-4xl text-5xl text-balance max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]"
              >
                Manage Your Business Smarter with Emporium
              </TextEffect>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="mx-auto mt-8 max-w-2xl text-lg text-balance"
              >
                A pre-built ecommerce dashboard for managing products, users, orders, and analytics
                with elegance and efficiency.
              </TextEffect>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
               
              >
                {session ? (
                  <div  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                    <div key={1}>
                      <Button asChild size="lg">
                        <Link href="#/dashboard">
                          <span className="text-nowrap">Start Building</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                    <div key={3}>
                      <Button asChild size="lg">
                        <Link href="/sign-in">
                          <span className="text-nowrap">Sign In</span>
                        </Link>
                      </Button>
                    </div>
                    <Button key={4} asChild size="lg" variant="ghost">
                      <Link href="#solution">
                        <span className="text-nowrap">Solutions</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </AnimatedGroup>
            </div>
          </div>

          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.75,
                  },
                },
              },
              ...transitionVariants,
            }}
          >
            <div className="relative mt-8 -mr-56 overflow-hidden mask-b-from-55% sm:mt-12 sm:mr-0 md:mt-20">
              <div className="ring-background bg-background relative mx-auto overflow-hidden rounded-2xl border shadow-lg ring-1 inset-shadow-2xs shadow-zinc-950/15 dark:inset-shadow-white/20">
                <Image
                  className="bg-background relative hidden rounded-2xl dark:block"
                  src="/images/dashboard-dark.png"
                  alt="app screen"
                  width="2700"
                  height="1440"
                />
                <Image
                  className="border-border/25 relative z-2 rounded-2xl border dark:hidden"
                  src="/images/dashboard.png"
                  alt="app screen"
                  width="2700"
                  height="1440"
                />
              </div>
            </div>
          </AnimatedGroup>
        </div>
      </section>
    </Container>
  )
}

export default Hero
