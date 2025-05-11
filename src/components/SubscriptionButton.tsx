'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Script from 'next/script';

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
  const [isGumroadLoaded, setIsGumroadLoaded] = useState(false);

  // Check if user is already subscribed
  useEffect(() => {
    if (session?.user) {
      checkSubscriptionStatus();
    } else {
      setLoading(false);
    }
  }, [session]);

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

  // Function to handle the button click
  const handleSubscriptionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      // Redirect to sign in page first
      window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`;
      return;
    }
    
    // Only try to open overlay if Gumroad JS is loaded
    if (isGumroadLoaded && window.GumroadOverlay) {
      const overlayOptions = {
        wanted: true
      };
      
      // Add user email if available
      if (session?.user?.email) {
        overlayOptions['email'] = session.user.email;
      }
      
      window.GumroadOverlay.show(productId, overlayOptions);
    } else {
      console.warn('Gumroad overlay not yet loaded');
    }
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

  return (
    <>
      <button
        className={`gumroad-button ${className}`}
        onClick={handleSubscriptionClick}
      >
        {buttonText}
      </button>
      
      <Script
        src="https://gumroad.com/js/gumroad.js"
        strategy="lazyOnload"
        onLoad={() => {
          setIsGumroadLoaded(true);
          console.log('Gumroad script loaded');
        }}
      />
    </>
  );
}