'use client'

import { useIdeasData } from "@/services/useIdeasData";
import { ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import SignupOverlay from "./SignupOverlay";

// Define filter types
export const FILTER_TYPES = {
  ALL: 'ALL',
  LOW_COMPETITION: 'LOW_COMPETITION',
  NEWEST: 'NEWEST',
  OLDEST: 'OLDEST',
};



export default async function ProductGrid() {
  const { data: session, status } = useSession();
  const [ isPremium, setIsPremium ] = useState(false)

  useEffect(()=>{
    if(session?.user) checkSubscriptionStatus()
  }, [session])

  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/check-subscription')
      const data = await response.json()
      setIsPremium(data.subscribed)

    } catch (error) {
      console.error('Failed to check subscription:', error)
      setIsPremium(false)

    }
  }
  
  const initialVisibleCount = 10;
  const incrementAmount = 10;
  const maxIdeas = session ? 100 : 10;
  
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const [activeFilter, setActiveFilter] = useState(FILTER_TYPES.NEWEST);
  
  // Convert filter type to query options
  const getQueryOptions = () => {
    let options = {
      searchTerm: '',
      limit: maxIdeas
    };
    
    switch (activeFilter) {
      case FILTER_TYPES.NEWEST:
        options = {
          ...options,
          orderBy: 'id', // Assuming id is incremental and can be used as a proxy for creation time
          orderDirection: 'desc'
        };
        break;
      case FILTER_TYPES.OLDEST:
        options = {
          ...options,
          orderBy: 'id', // Assuming id is incremental and can be used as a proxy for creation time
          orderDirection: 'asc'
        };
        break;
      case FILTER_TYPES.LOW_COMPETITION:
        // Simplified JSON path access
        options = {
          ...options,
          orderBy: 'id', // Fallback to ID sorting first
          orderDirection: 'asc'
        };
        break;
      case FILTER_TYPES.ALL:
      default:
        options = {
          ...options,
          orderBy: 'title',
          orderDirection: 'asc'
        };
        break;
    }
    
    return options;
  };
  
  const { ideas: products, loading, error, totalCount, refetch } = useIdeasData(getQueryOptions());
  
  const handleLoadMore = () => {
    setVisibleCount(prevCount => Math.min(prevCount + incrementAmount, products?.length || 0));
  };
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setVisibleCount(initialVisibleCount); // Reset visible count when filter changes
  };
  
  const visibleProducts = products?.slice(0, visibleCount);
  const hasMoreToLoad = products?.length > visibleCount;
  
  return (
    <section className="border-x border-b py-8 md:py-12 border-black">
      <div className="mx-auto px-3 sm:px-8">
        {/* Header with Dashboard-style Title */}
        <div className="mb-8 border border-black bg-white">
          <div className="bg-gray-800 px-4 py-3 border-b border-gray-400">
            <h2 className="text-xl font-bold text-white font-mono tracking-wider">IDEA ARCHIVE</h2>
          </div>
          <div className="p-4 text-center">
            <p className="font-mono text-sm leading-relaxed max-w-3xl mx-auto">
              We live by digging through trends, analyzing markets, and brainstorming so you don't have to stress about coming up with the next big idea. This Archive is updated every day.
            </p>
          </div>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2 border border-black bg-gray-200 p-3">
          <span className="font-mono text-xs font-bold">FILTER BY:</span>
          <button 
            className={`px-3 py-1 text-xs font-mono border border-gray-400 hover:bg-gray-100 ${
              activeFilter === FILTER_TYPES.ALL 
                ? 'bg-gray-800 text-white' 
                : 'bg-white text-gray-800'
            }`}
            onClick={() => handleFilterChange(FILTER_TYPES.ALL)}
          >
            ALL IDEAS
          </button>
          <button 
            className={`px-3 py-1 text-xs font-mono border border-gray-400 hover:bg-gray-100 ${
              activeFilter === FILTER_TYPES.LOW_COMPETITION 
                ? 'bg-gray-800 text-white' 
                : 'bg-white text-gray-800'
            }`}
            onClick={() => handleFilterChange(FILTER_TYPES.LOW_COMPETITION)}
          >
            LOW COMPETITION
          </button>
          <button 
            className={`px-3 py-1 text-xs font-mono border border-gray-400 hover:bg-gray-100 ${
              activeFilter === FILTER_TYPES.NEWEST 
                ? 'bg-gray-800 text-white' 
                : 'bg-white text-gray-800'
            }`}
            onClick={() => handleFilterChange(FILTER_TYPES.NEWEST)}
          >
            NEWEST
          </button>
          <button 
            className={`px-3 py-1 text-xs font-mono border border-gray-400 hover:bg-gray-100 ${
              activeFilter === FILTER_TYPES.OLDEST 
                ? 'bg-gray-800 text-white' 
                : 'bg-white text-gray-800'
            }`}
            onClick={() => handleFilterChange(FILTER_TYPES.OLDEST)}
          >
            OLDEST
          </button>
        </div>
        
        {loading ? (
          <div className="p-6 text-center border border-black bg-white">
            <p className="font-mono text-gray-600">Loading ideas...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center border border-black bg-white">
            <p className="font-mono text-red-600">Error loading ideas. Please try again.</p>
          </div>
        ) : visibleProducts?.length === 0 ? (
          <div className="p-6 text-center border border-gray-400 bg-white">
            <p className="font-mono text-gray-600">No ideas found. Please check back later.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {visibleProducts.map((product, index) => {
                const BlurItem = index > 4 ? `${!isPremium && "blur-sm pointer-events-none"}` : "";
                
                return (
                  <ProductCard
                    className={BlurItem}
                    key={product.id}
                    title={product.title}
                    description={product.excerpt}
                    category={product.main_keyword}
                    accent={"#F6BD41"}
                    id={product.id}
                    competition={product?.market_analysis?.competition_level}
                    createdAt={product.created_at} // Pass the creation date to the ProductCard
                  />
                );
              })}
            </div>
            
            {/* Load More Button */}
            {hasMoreToLoad && session && (
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={handleLoadMore}
                  className="flex items-center gap-2 border border-black bg-white hover:bg-gray-100 px-6 py-3 font-mono text-sm transition-colors"
                >
                  <span>LOAD MORE IDEAS</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {/* Signup Overlay */}
            {!session && (
              <div className="absolute bottom-0 w-full">
                <SignupOverlay />
              </div>
            )}
            
            {/* Ideas Count Display */}
            <div className="mt-6 text-center">
              <p className="font-mono text-xs text-gray-600">
                Showing {visibleProducts?.length} of {session ? totalCount : `10${totalCount > 10 ? '+' : ''}`} ideas
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}