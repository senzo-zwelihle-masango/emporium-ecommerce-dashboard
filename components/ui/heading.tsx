import * as React from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const headingVariants = cva('', {
  variants: {
    size: {
      // Base sizes (mobile-first)
      xs: 'text-xs md:text-sm',
      sm: 'text-sm md:text-base',
      base: 'text-base md:text-lg',
      lg: 'text-lg md:text-xl',
      xl: 'text-xl md:text-2xl',
      '2xl': 'text-2xl md:text-3xl',
      '3xl': 'text-3xl md:text-4xl',
      '4xl': 'text-4xl md:text-5xl',
      '5xl': 'text-5xl md:text-6xl',
      '6xl': 'text-6xl md:text-7xl',
      '7xl': 'text-7xl md:text-8xl',
      '8xl': 'text-8xl md:text-9xl',
      '9xl': 'text-9xl md:text-[10rem]',
      '10xl': 'text-[10rem] md:text-[12rem]',
      '11xl': 'text-[12rem] md:text-[14rem]',
      '12xl': 'text-[14rem] md:text-[16rem]',
    },
    spacing: {
      tighter: 'tracking-tighter',
      tight: 'tracking-tight',
      normal: 'tracking-normal',
      wide: 'tracking-wide',
      wider: 'tracking-wider',
      widest: 'tracking-widest',
    },

    lineHeight: {
      none: 'leading-none',
      sm: 'leading-3',
      md: 'leading-4',
      lg: 'leading-5',
      xl: 'leading-6',
      '2xl': 'leading-7',
    },
    weight: {
      thin: 'font-thin',
      extralight: 'font-extralight',
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      black: 'font-black',
    },
    margin: { none: '', sm: 'mb-3', md: 'mb-10', lg: 'mb-20' },
  },
})

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  href?: string
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      className,
      children,

      size,
      spacing,
      lineHeight,
      weight,
      margin,

      ...props
    },
    ref
  ) => {
    return (
      <h1
        className={cn(
          headingVariants({
            className,
            size,
            spacing,
            lineHeight,
            weight,
            margin,
          })
        )}
        ref={ref}
        {...props}
      >
        {children}
      </h1>
    )
  }
)
Heading.displayName = 'Heading'

export { Heading, headingVariants }
