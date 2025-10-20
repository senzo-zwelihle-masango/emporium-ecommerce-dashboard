import React from 'react'
import { Container } from '@/components/ui/container'
import Image from 'next/image'

const Solution = () => {
  return (
    <Container
      size="2xl"
      alignment="none"
      height="full"
      padding="px-sm"
      gap="none"
      flow="none"
      id="solution"
      className="solution"
    >
      <div className="mx-auto space-y-8 md:space-y-16">
        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
          The Emporium Dashboard powers your entire eCommerce ecosystem.
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          {/* Left: Visual */}
          <div className="relative mb-6 sm:mb-0">
            <div className="relative aspect-76/59 rounded-2xl bg-linear-to-b from-zinc-300 to-transparent p-px dark:from-zinc-700">
              <Image
                src="/images/dashboard-hero-dark.png"
                className="hidden rounded-[15px] dark:block"
                alt="Emporium dashboard dark preview"
                width={1207}
                height={929}
              />
              <Image
                src="/images/dashboard-hero.png"
                className="rounded-[15px] shadow dark:hidden"
                alt="Emporium dashboard light preview"
                width={1207}
                height={929}
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              <span className="text-accent-foreground font-bold">Emporium</span> unifies every part
              of your business — from product management and analytics to orders, inventory, and
              team workflows — all in one intuitive dashboard.
            </p>
            <p className="text-muted-foreground">
              Designed for developers, teams, and store owners, it gives you a scalable foundation
              that grows with your business. Connect your data, automate your sales, and make
              smarter decisions powered by live insights.
            </p>

            <div className="pt-6">
              <blockquote className="border-l-4 pl-4">
                <p>
                  “The Emporium Dashboard helped us consolidate sales, stock, and marketing data in
                  minutes. It&apos;s the kind of simplicity you don&apos;t realize you&apos;ve been missing until
                  you have it.”
                </p>

                <div className="mt-6 space-y-3">
                  <cite className="block font-medium">Senzo Masango, Founder at Elysian Emporium Ecommerce</cite>
                  <Image
                    src="https://94ig6q1xa3.ufs.sh/f/iU9Jr3jKqbAtXRzIt1Z6E5Xvmqbl7HLoBufOAjg0chxayiRt"
                    alt="Shopify Logo"
                    width={60}
                    height={60}
                    className='rounded-md grayscale'
                  />
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Solution
