import ProductGrid from '@/components/ProductGrid'
import Hero from '@/components/sections/Hero'
import React from 'react'
import Dashboard from './Dashboard'
import SubscriptionButton from './SubscriptionButton'
import PremiumCTA from './PremiumCTA'

const SignedComponent = () => {
  return (
    <div className='pb-16'>
        <Dashboard/>
        <PremiumCTA />
        <ProductGrid />
        <Hero className=""/>
        <SubscriptionButton productId='ideas'/>
        
        
    </div>
  )
}

export default SignedComponent