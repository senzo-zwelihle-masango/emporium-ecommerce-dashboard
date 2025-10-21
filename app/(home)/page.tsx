import Hero from '@/components/home/hero'
import Pricing from '@/components/home/pricing'
import Solution from '@/components/home/solution'
import React from 'react'

const Home = () => {
  return (
    <div className="mb-40 space-y-40 overflow-hidden">
      <Hero />
      <Solution />
      <Pricing />
    </div>
  )
}

export default Home
