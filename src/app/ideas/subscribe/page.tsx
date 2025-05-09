'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SubscriptionButton from '@/components/SubscriptionButton';

export default function SubscribePage() {
  const { data: session, status } = useSession();
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
  
  useEffect(() => {
    if (session?.user) {
      fetchSubscriptionInfo();
    }
  }, [session]);
  
  const fetchSubscriptionInfo = async () => {
    try {
      const response = await fetch('/api/check-subscription');
      const data = await response.json();
      setSubscriptionInfo(data);
    } catch (error) {
      console.error('Error fetching subscription info:', error);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Subscribe to Premium</h1>
      
      {status === 'loading' ? (
        <div className="animate-pulse">Loading...</div>
      ) : !session ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-8">
          <p>Please sign in to subscribe to premium features.</p>
          <a 
            href="/api/auth/signin"
            className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Sign In
          </a>
        </div>
      ) : (
        <div className="space-y-8">
          {subscriptionInfo?.subscribed ? (
            <div className="bg-green-50 border border-green-200 p-6 rounded-md">
              <h2 className="text-xl font-semibold text-green-700">Active Subscription</h2>
              <p className="mt-2">You currently have an active {subscriptionInfo.plan} subscription.</p>
              {subscriptionInfo.expiresAt && (
                <p className="mt-2">
                  Current period ends: {new Date(subscriptionInfo.expiresAt).toLocaleDateString()}
                </p>
              )}
              {subscriptionInfo.cancelAtPeriodEnd && (
                <p className="mt-2 text-amber-600">
                  Your subscription will not renew after the current period.
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold">Monthly Plan</h2>
                  <p className="text-3xl font-bold mt-2">$9.99<span className="text-base font-normal text-gray-500">/month</span></p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Feature 1
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Feature 2
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Feature 3
                    </li>
                  </ul>
                  <div className="mt-6">
                    <SubscriptionButton 
                      productId="tvjili" 
                      buttonText="Subscribe Monthly"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    />
                  </div>
                </div>
                
                <div className="border rounded-lg p-6 shadow-sm border-blue-200 bg-blue-50">
                  <div className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full mb-2">
                    BEST VALUE
                  </div>
                  <h2 className="text-xl font-bold">Annual Plan</h2>
                  <p className="text-3xl font-bold mt-2">$99.99<span className="text-base font-normal text-gray-500">/year</span></p>
                  <p className="text-sm text-green-600 font-medium">Save 20% compared to monthly</p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      All Monthly Features
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Premium Feature 1
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Premium Feature 2
                    </li>
                  </ul>
                  <div className="mt-6">
                    <SubscriptionButton 
                      productId="YOUR_ANNUAL_PRODUCT_ID" 
                      buttonText="Subscribe Yearly"
                      className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mt-8">
                <h3 className="font-medium">Why Subscribe?</h3>
                <p className="mt-2 text-gray-600">
                  Your subscription helps us continue to provide quality content and features.
                  Cancel anytime from your Gumroad account.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}