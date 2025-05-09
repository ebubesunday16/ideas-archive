'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function SignupOverlay({ type = 'standard', maxItems = 5 }) {
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  
  // Different content based on authentication status
  const title = isAuthenticated 
    ? 'UPGRADE YOUR ACCOUNT' 
    : 'UNLOCK MORE IDEAS';
    
  const description = isAuthenticated
    ? `You've reached the limit of ${maxItems} ideas with your free account.`
    : `Sign up to access up to ${maxItems * 2} ideas from our archive.`;
    
  const buttonText = isAuthenticated ? 'SUBSCRIBE NOW' : 'SIGN UP';
  const buttonLink = isAuthenticated ? '/subscription' : '/api/auth/signin';

  // For statistics display
  const stats = [
    { label: 'AVAILABLE IDEAS', value: '100+' },
    { label: 'WEEKLY UPDATES', value: '5-10' },
    { label: 'SUCCESS RATE', value: '78%' }
  ];

  return (
    <div className="border-2 border-gray-400 bg-white">
      {/* Header bar - matching the dashboard style */}
      <div className="bg-gray-800 px-3 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-gray-300" />
          <span className="text-gray-300 font-mono text-sm">
            {type === 'compact' ? title : 'ACCESS RESTRICTED'}
          </span>
        </div>
        {type !== 'compact' && (
          <div className="bg-gray-700 px-2 py-1 text-xs text-gray-300 font-mono">
            {maxItems}/{isAuthenticated ? '10' : '100+'} IDEAS
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="p-4">
        {type !== 'compact' && (
          <h2 className="font-mono text-xl font-bold mb-3 text-center">{title}</h2>
        )}
        
        <p className="font-mono text-sm text-center mb-4">{description}</p>
        
        {/* Stats section - only in full version */}
        {type !== 'compact' && (
          <div className="grid grid-cols-3 gap-2 mb-4 border-t border-b border-gray-300 py-3">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-mono font-bold text-lg">{stat.value}</div>
                <div className="font-mono text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
        
        {/* Benefits list */}
        <div className="mb-4">
          <div className="font-mono text-xs text-gray-500 mb-2">{type === 'compact' ? 'BENEFITS:' : 'WHAT YOU GET:'}</div>
          <ul className="space-y-2 font-mono text-sm">
            <li className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-800" />
              {isAuthenticated ? 'Full access to all ideas' : 'Access to 10 ideas'}
            </li>
            <li className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gray-800" />
              {isAuthenticated ? 'Weekly updates via email' : 'Save your favorite ideas'}
            </li>
            {type !== 'compact' && (
              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-gray-800" />
                {isAuthenticated ? 'Download ideas as PDF' : 'Weekly newsletter'}
              </li>
            )}
          </ul>
        </div>
        
        {/* Action button */}
        <div className="flex justify-center">
          <a 
            href={buttonLink}
            className="bg-gray-800 text-white px-8 py-2 font-mono text-sm hover:bg-gray-700 flex items-center gap-2"
          >
            {buttonText}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
      
      {/* Footer - only in full version */}
      {type !== 'compact' && (
        <div className="bg-gray-100 px-3 py-2 border-t border-gray-400">
          <p className="font-mono text-xs text-center text-gray-500">
            {isAuthenticated 
              ? 'Cancel anytime. No commitment required.'
              : 'No credit card required for sign up.'}
          </p>
        </div>
      )}
    </div>
  );
}