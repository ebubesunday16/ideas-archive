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
  const [isWaitingForGumroad, setIsWaitingForGumroad] = useState(false);
  
  // Store click details for delayed execution
  const [pendingOverlayRequest, setPendingOverlayRequest] = useState<null | {
    productId: string;
    options: any;
  }>(null);

  // Check if user is already subscribed
  useEffect(() => {
    if (session?.user) {
      checkSubscriptionStatus();
    } else {
      setLoading(false);
    }
  }, [session]);

  // Effect to handle pending overlay requests when script loads
  useEffect(() => {
    if (isGumroadLoaded && pendingOverlayRequest && window.GumroadOverlay) {
      // Execute the pending request
      window.GumroadOverlay.show(
        pendingOverlayRequest.productId,
        pendingOverlayRequest.options
      );
      setPendingOverlayRequest(null);
      setIsWaitingForGumroad(false);
    }
  }, [isGumroadLoaded, pendingOverlayRequest]);

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
    
    const overlayOptions = {
      wanted: true
    };
    
    // Add user email if available
    if (session?.user?.email) {
      overlayOptions['email'] = session.user.email;
    }
    
    // Check if Gumroad is loaded
    if (isGumroadLoaded && window.GumroadOverlay) {
      // Open overlay immediately
      window.GumroadOverlay.show(productId, overlayOptions);
    } else {
      // Queue the request and show loading state
      setIsWaitingForGumroad(true);
      setPendingOverlayRequest({
        productId,
        options: overlayOptions
      });
      
      // Safety timeout - if script doesn't load after 5 seconds, redirect to Gumroad directly
      setTimeout(() => {
        if (isWaitingForGumroad) {
          console.warn('Gumroad script load timeout - redirecting instead');
          window.location.href = `https://gumroad.com/l/${productId}?wanted=true${
            session?.user?.email ? `&email=${encodeURIComponent(session.user.email)}` : ''
          }`;
        }
      }, 5000);
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
        disabled={isWaitingForGumroad}
      >
        {isWaitingForGumroad ? 'Loading...' : buttonText}
      </button>
      
      <Script
        src="https://gumroad.com/js/gumroad.js"
        strategy="beforeInteractive" // Load earlier in the page lifecycle
        onLoad={() => {
          setIsGumroadLoaded(true);
          console.log('Gumroad script loaded');
        }}
      />
    </>
  );
}