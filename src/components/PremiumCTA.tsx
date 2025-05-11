'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Lock, ArrowRight, Zap, Star, Sparkles } from 'lucide-react';

export default function PremiumCTA({ productId = 'ideas' }) {
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const [isHovered, setIsHovered] = useState(false);
  
  // Gumroad script loading
  useState(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://gumroad.com/js/gumroad.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

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
  
  return (
    <div className="border-2 border-gray-800 bg-gray-50 overflow-hidden relative">
      {/* Premium badge corner ribbon */}
      <div className="absolute top-0 right-0">
        <div className="bg-yellow-400 text-gray-900 font-mono text-xs px-8 py-1 rotate-45 translate-x-6 translate-y-3">
          PREMIUM
        </div>
      </div>
      
      {/* Header bar */}
      <div className="bg-gray-800 px-4 py-3 flex justify-between items-center">
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
      <div className="p-5">
        <h2 className="font-mono text-xl font-bold mb-3 text-center">
          BECOME AN EXCLUSIVE MEMBER
        </h2>
        
        <p className="font-mono text-sm text-center mb-5">
          Get unlimited access to our idea archive, updates, and be a supporter to this journey.
        </p>
        
        {/* Features grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border border-gray-300 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="font-mono font-bold">UNLIMITED IDEAS</span>
            </div>
            <p className="font-mono text-xs text-gray-600">
              Get firsthand update to ideas as they pop up everyday.
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
              <span className="font-mono font-bold">SUPPORT</span>
            </div>
            <p className="font-mono text-xs text-gray-600">
              Outgenerate is managed by users who pay. Support our effort by being a subscriber.
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
      
      {/* Footer */}
      <div className="bg-gray-200 px-4 py-3 border-t border-gray-300">
        <div className="flex justify-between items-center">
          <p className="font-mono text-xs">
            <span className="text-gray-500">Users: </span>
            <span className="font-bold">400+</span>
          </p>
          <p className="font-mono text-xs">
            <span className="text-gray-500">Success rate: </span>
            <span className="font-bold">87%</span>
          </p>
        </div>
      </div>
    </div>
  );
}