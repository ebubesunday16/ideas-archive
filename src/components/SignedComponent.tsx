import ProductGrid from '@/components/ProductGrid'
import Hero from '@/components/sections/Hero'
import Dashboard from './Dashboard'
import PremiumCTA from './PremiumCTA'

const SignedComponent = () => {
  return (
    <div className='pb-16'>
        <Dashboard/>
        <PremiumCTA />
        <ProductGrid />
        <Hero className=""/>
        
        
    </div>
  )
}

export default SignedComponent