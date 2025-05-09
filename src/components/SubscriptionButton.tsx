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
  
  // Check if user is already subscribed
  useEffect(() => {
    if (session?.user) {
      checkSubscriptionStatus();
    } else {
      setLoading(false);
    }
  }, [session]);
  
  // Handle Gumroad overlay initialization
  useEffect(() => {
    // Initialize Gumroad overlay when component mounts
    const script = document.createElement('script');
    script.src = 'https://gumroad.com/js/gumroad.js';
    script.async = true;
    script.onload = () => {
      if (window.GumroadOverlay) {
        window.GumroadOverlay.reload();
      }
    };
    document.body.appendChild(script);
    
    // Cleanup function
    return () => {
      document.body.removeChild(script);
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
  
  // Function to handle the button click
  const handleSubscriptionClick = (e: React.MouseEvent) => {
    if (!session?.user) {
      e.preventDefault();
      // Redirect to sign in page first
      window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`;
      return false;
    }
    
    // Add email as a custom field to pass to Gumroad
    if (session?.user?.email) {
      const overlay = document.querySelector('.gumroad-overlay-iframe');
      if (overlay) {
        overlay.setAttribute('data-email', session.user.email);
      }
    }
    
    return true;
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
      <a
        className={`gumroad-button ${className}`}
        href={`https://gumroad.com/l/${productId}`}
        data-gumroad-overlay-checkout="true"
        onClick={handleSubscriptionClick}
      >
        {buttonText}
      </a>
      
      {/* Add hidden email field to help with webhook processing */}
      {session?.user?.email && (
        <input 
          type="hidden" 
          name="email" 
          id="gumroad-custom-email" 
          value={session.user.email} 
        />
      )}
    </>
  );
}