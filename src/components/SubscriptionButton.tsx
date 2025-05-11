'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface SubscriptionButtonProps {
  productId: string;
  buttonText?: string;
  className?: string;
}

export default function SubscriptionButton({
  productId,
  buttonText = 'Subscribe Now',
  className = '',
}: SubscriptionButtonProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const gumroadScriptRef = useRef<HTMLScriptElement | null>(null);

  // Check if user is already subscribed
  useEffect(() => {
    if (session?.user) {
      checkSubscriptionStatus();
    } else {
      setLoading(false);
    }
  }, [session]);

  // Manual script loading for Gumroad
  useEffect(() => {
    if (!gumroadScriptRef.current && typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://gumroad.com/js/gumroad.js';
      script.async = true;
      script.onload = () => {
        console.log('Gumroad script loaded successfully');
      };
      
      document.body.appendChild(script);
      gumroadScriptRef.current = script;
    }
    
    // Cleanup function
    return () => {
      if (gumroadScriptRef.current && document.body.contains(gumroadScriptRef.current)) {
        document.body.removeChild(gumroadScriptRef.current);
      }
    };
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/check-subscription');
      const data = await response.json();
      
      setIsSubscribed(data.subscribed);
      setSubscriptionData(data);
    } catch (error) {
      console.error('Failed to check subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the button click for non-authenticated users
  const handleSubscriptionClick = (e: React.MouseEvent) => {
    if (!session?.user) {
      e.preventDefault();
      // Redirect to sign in page first
      window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`;
    }
    // For authenticated users, let the default link behavior work
    // Gumroad's script will intercept it and show the overlay
  };

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (isSubscribed) {
    return (
      <div className="text-green-600 font-medium">
        <p>You are subscribed!</p>
        <p className="text-sm text-gray-600">
          {subscriptionData?.plan && `Plan: ${subscriptionData.plan}`}
        </p>
      </div>
    );
  }

  // Build the Gumroad URL with query parameters
  const gumroadUrl = `https://outgenerate.gumroad.com/l/${productId}?wanted=true${
    session?.user?.email ? `&email=${encodeURIComponent(session.user.email)}` : ''
  }`;

  return (
    <a
    
      className={`gumroad-button ${className}`}
      href={gumroadUrl}
      onClick={handleSubscriptionClick}
    >
      {buttonText}
    </a>
  );
}