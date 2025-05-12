import { RocketLaunch } from '@/assets/svgs'
import ThemeButton from '@/components/ThemeButton'
import Link from 'next/link'
import React, { ReactNode } from 'react'

const OrderButton = ({children, className}: {children: string, className?: string}) => {
  return (
    <ThemeButton className={`bg-white group relative overflow-hidden ${className}`}>
        <Link href={'https://outgenerate.gumroad.com/l/order'}>
        
    <span className="relative z-10 flex items-center justify-center">
      {children}<RocketLaunch className="ml-2 inline-block group-hover:translate-x-1 transition-transform duration-200"/>
    </span>
    <span className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
    </Link>
  </ThemeButton>
  )
}

export default OrderButton