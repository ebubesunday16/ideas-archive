'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Lock, ArrowRight, Zap, Star, Sparkles, Check } from 'lucide-react';

export default function PremiumCTA({ 
  productId = 'ideas',
  // Optional prop to hide the component for premium users
  hideForPremium = true
}) {
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  
  // Check if user is premium subscriber
  useEffect(() => {
    if (session?.user) {
      checkSubscriptionStatus();
    } else {
      setLoading(false);
    }
  }, [session]);

  // Check subscription status
  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/check-subscription');
      const data = await response.json();
      
      setIsPremium(data.subscribed);
    } catch (error) {
      console.error('Failed to check subscription:', error);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };
  
  // Gumroad script loading
  useEffect(() => {
    if (typeof window !== 'undefined' && !isPremium) {
      const script = document.createElement('script');
      script.src = 'https://gumroad.com/js/gumroad.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isPremium]);

  // Build the Gumroad URL with query parameters
  const gumroadUrl = `https://outgenerate.gumroad.com/l/${productId}?wanted=true${
    session?.user?.email ? `&email=${encodeURIComponent(session.user.email)}` : ''
  }`;
  
  // Function to handle the button click for non-authenticated users
  const handleSubscriptionClick = (e) => {
    if (!session?.user) {
      e.preventDefault();
      // Redirect to sign in page first
      window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`;
    }
    // For authenticated users, let the default link behavior work
    // Gumroad's script will intercept it and show the overlay
  };
  
  // If loading, show loading state
  if (loading) {
    return (
      <div className="border-2 border-gray-800 bg-gray-50 p-6">
        <div className="animate-pulse flex flex-col items-center justify-center">
          <div className="h-6 bg-gray-300 w-3/4 mb-4 rounded"></div>
          <div className="h-4 bg-gray-300 w-1/2 mb-2 rounded"></div>
          <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
        </div>
      </div>
    );
  }
  
  // If user is premium and we want to hide for premium users, return null
  if (isPremium && hideForPremium) {
    return null;
  }
  
  // If user is premium but we want to show something (hideForPremium = false)
  if (isPremium) {
    return (
      <div className="border-2 border-green-600 bg-green-50 overflow-hidden">
        <div className="bg-green-600 px-3 sm:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-white" />
            <span className="text-white font-mono text-sm font-bold">
              PREMIUM ACTIVE
            </span>
          </div>
          <div className="bg-green-700 px-2 py-1 text-xs text-green-100 font-mono">
            SUBSCRIBED
          </div>
        </div>
        <div className="p-4 text-center">
          <p className="font-mono text-sm mb-1">
            You have full access to all premium features.
          </p>
          <p className="font-mono text-xs text-gray-500">
            Thank you for your support!
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border-2 border-gray-800 bg-gray-50 overflow-hidden relative">
      {/* Premium badge corner ribbon */}
      <div className="absolute top-0 right-0">
        <div className="bg-yellow-400 text-gray-900 font-mono text-xs px-8 py-1 rotate-45 translate-x-6 translate-y-3">
          PREMIUM
        </div>
      </div>
      
      {/* Header bar */}
      <div className="bg-gray-800 px-3 sm:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-yellow-400" />
          <span className="text-white font-mono text-sm font-bold">
            PREMIUM ACCESS
          </span>
        </div>
        <div className="bg-gray-700 px-2 py-1 text-xs text-gray-300 font-mono">
          UNLOCK NOW
        </div>
      </div>
      
      {/* Main content */}
      <div className="py-5 px-3 sm:px-8">
        {/* Features grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          
          
        <div className="border border-gray-300 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="font-mono font-bold"> UNLIMITED IDEAS</span>
            </div>
            <p className="font-mono text-xs text-gray-600">
            Get unlimited access to our premium idea archive and exclusive tools.
            </p>
          </div>

          <div className="border border-gray-300 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-mono font-bold">PREMIUM FILTERS</span>
            </div>
            <p className="font-mono text-xs text-gray-600">
              Sort by profitability, difficulty and market size
            </p>
          </div>
          
          <div className="border border-gray-300 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="font-mono font-bold">WEEKLY UPDATES</span>
            </div>
            <p className="font-mono text-xs text-gray-600">
              Get 5-10 fresh market opportunities every week
            </p>
          </div>
          
          
          
        </div>
        
        
        {/* Action button */}
        <div className="flex justify-center mb-4">
          <a 
            href={gumroadUrl}
            onClick={handleSubscriptionClick}
            className="gumroad-button bg-gray-800 text-white px-10 py-3 font-mono font-bold text-sm hover:bg-gray-700 flex items-center gap-2 transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered ? 'GET PREMIUM NOW' : 'UNLOCK PREMIUM'}
            <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
          </a>
        </div>
        
        {/* Price info */}
        <p className="text-center font-mono text-xs text-gray-500">
        Only $9.99/month • Cancel anytime • 30-day money back guarantee
        </p>
      </div>
      
      
      
    </div>
  );
}