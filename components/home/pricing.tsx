import React from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import Link from 'next/link'
import { CheckIcon } from 'lucide-react'
import { Container } from '../ui/container'
import { GitHubIcon } from '../icons/github'

const Pricing = () => {
  return (
    <Container
      size="2xl"
      alignment="none"
      height="full"
      padding="px-sm"
      gap="none"
      flow="none"
      id="pricing"
      className="overflow-hidden"
    >
      <div className="mx-auto">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            Transparent pricing built for creators and teams
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-lg text-balance">
            Emporium is free to use — clone it, extend it, or let us help you build your dream store
            with custom integrations.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="mt-8 md:mt-16">
          <Card className="relative">
            <div className="grid items-center gap-12 divide-y p-12 md:grid-cols-2 md:divide-x md:divide-y-0">
              {/* Left Column: Plan Info */}
              <div className="pb-12 text-center md:pr-12 md:pb-0">
                <h3 className="text-2xl font-semibold">Emporium Free Suite</h3>
                <p className="mt-2 text-lg">Full access, developer-ready</p>

                <span className="mt-12 mb-6 inline-block text-6xl font-bold">
                  <span className="text-4xl">R</span> 0
                </span>

                <div className="flex justify-center gap-3">
                  <Button size="lg" variant="default">
                    <Link
                      href="https://github.com/senzo-zwelihle-masango/elysian-emporium-ecommerce.git"
                      target="_blank"
                    >
                      GitHub
                    </Link>
                    <GitHubIcon />
                  </Button>
                  {/* <Button asChild size="lg" variant="outline">
                    <Link href="/contact">Request Integration</Link>
                  </Button> */}
                </div>

                <p className="text-muted-foreground mt-12 text-sm">
                  Build independently or collaborate with our team for custom storefront integration
                  and advanced analytics.
                </p>
              </div>

              {/* Right Column: Features */}
              <div className="relative">
                <ul role="list" className="space-y-4">
                  {[
                    '100% free and open source',
                    'Standalone or connected dashboard setup',
                    'Custom store builds and integrations on request',
                    'Access to analytics, order management, and inventory tools',
                    'Modern stack — Next.js 15, Prisma, Tailwind, shadcn/ui',
                    'Perfect for SaaS, marketplaces, and digital stores',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckIcon className="text-primary size-3" strokeWidth={3.5} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-sm">
                  Developers can deploy their own version, integrate APIs, or collaborate for
                  fully-managed builds — the choice is yours.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  )
}

export default Pricing
