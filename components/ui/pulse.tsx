"use client"

import React from "react"
import { motion } from "motion/react"

const PulseAnimation = () => {
  // pulse effect
  const createBreathAnimation = (delay: number) => ({
    initial: { scale: 1, opacity: 0.6 },
    animate: {
      scale: [1, 1.15, 1],
      opacity: [0.6, 0.8, 0.6],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatDelay: 1,
        delay: delay,
        ease: "easeInOut" as const
      }
    }
  })

  //   circles
  const circles = [
    {
      size: "w-12 h-12 sm:w-16 sm:h-16",
      delay: 0,
      opacity: "opacity-90",
      bgColor: "bg-black/90 dark:bg-white/90"
    },
    {
      size: "w-20 h-20 sm:w-32 sm:h-32",
      delay: 0.6,
      opacity: "opacity-75",
      bgColor: "bg-black/75 dark:bg-white/75"
    },
    {
      size: "w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56",
      delay: 1.2,
      opacity: "opacity-60",
      bgColor: "bg-black/60 dark:bg-white/60"
    },
    {
      size: "w-44 h-44 sm:w-64 sm:h-64 lg:w-72 lg:h-72",
      delay: 1.8,
      opacity: "opacity-50",
      bgColor: "bg-black/50 dark:bg-white/50"
    },
    {
      size: "w-56 h-56 sm:w-80 sm:h-80 lg:w-96 lg:h-96",
      delay: 2.4,
      opacity: "opacity-40",
      bgColor: "bg-black/40 dark:bg-white/40"
    },
    {
      size: "w-72 h-72 sm:w-96 sm:h-96 lg:w-112 lg:h-112 xl:w-128 xl:h-128",
      delay: 3.0,
      opacity: "opacity-30",
      bgColor: "bg-black/30 dark:bg-white/30"
    }
  ]
  return (
    <div className="relative">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(circle at center, 
            oklch(0.4828 0.2975 277.51 / 0.1) 0%, 
            oklch(0.3697 0.2222 279.6 / 0.05) 50%,
            transparent 100%)`
        }}
      />
      {/* animation */}
      <div className="relative flex items-center justify-center">
        {circles.map((circle, index) => (
          <motion.div
            key={index}
            className="absolute"
            variants={createBreathAnimation(circle.delay)}
            initial="initial"
            animate="animate"
          >
            <div
              className={`${circle.size} rounded-full shadow-lg backdrop-blur-sm ${circle.opacity} ${circle.bgColor || "bg-black/40 dark:bg-white/40"} border border-black/10 shadow-[0_0_20px_rgba(0,0,0,0.08)] transition-colors duration-200 dark:border-white/10 dark:shadow-[0_0_20px_rgba(255,255,255,0.08)]`}
            ></div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default PulseAnimation
