'use client'

import { useIdeasData } from "@/services/useIdeasData";
import { ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ProductCard from "./ProductCard";
import SignupOverlay from "./SignupOverlay";

export default function ProductGrid() {
  const { data: session, status } = useSession();
  
  const initialVisibleCount = 10;
  const incrementAmount = 10;
  
  
  const maxIdeas = session ? 100 : 10;
  
  
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  
  
  const { ideas: products, loading, error, totalCount } = useIdeasData({
    searchTerm: '', 
    limit: maxIdeas
  });
  
  
  const handleLoadMore = () => {
    setVisibleCount(prevCount => Math.min(prevCount + incrementAmount, products?.length || 0));
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
          <button className="bg-white text-gray-800 px-3 py-1 text-xs font-mono border border-gray-400 hover:bg-gray-100">
            ALL IDEAS
          </button>
          <button className="bg-white text-gray-800 px-3 py-1 text-xs font-mono border border-gray-400 hover:bg-gray-100">
            LOW COMPETITION
          </button>
          <button className="bg-white text-gray-800 px-3 py-1 text-xs font-mono border border-gray-400 hover:bg-gray-100">
            TRENDING
          </button>
          <button className="bg-white text-gray-800 px-3 py-1 text-xs font-mono border border-gray-400 hover:bg-gray-100">
            NEWEST
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
                const BlurItem = index > 4 ? `${!session && "blur-sm pointer-events-none"}` : "";
                
                return (
                  <ProductCard
                    className={BlurItem}
                    key={index}
                    title={product.title}
                    description={product.excerpt}
                    category={product.main_keyword}
                    accent={"#F6BD41"}
                    id={product.id}
                    competition={product?.market_analysis?.competition_level}
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