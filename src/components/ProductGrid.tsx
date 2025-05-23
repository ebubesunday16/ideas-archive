'use client'

import { useIdeasData } from "@/services/useIdeasData";
import { ChevronDown, Filter, Sparkles, TrendingUp, Clock, Globe, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import SignupOverlay from "./homepageui/SignupOverlay";
import Link from "next/link";

// Define filter types
export const FILTER_TYPES = {
  ALL: 'ALL',
  LOW_COMPETITION: 'LOW_COMPETITION',
  NEWEST: 'NEWEST',
  OLDEST: 'OLDEST',
};

// Filter configurations with icons and descriptions
const FILTER_CONFIG = {
  [FILTER_TYPES.ALL]: {
    label: 'All Ideas',
    icon: Globe,
    description: 'Browse everything',
    color: 'from-gray-500 to-gray-600'
  },
  [FILTER_TYPES.LOW_COMPETITION]: {
    label: 'Low Competition',
    icon: TrendingUp,
    description: 'Easy opportunities',
    color: 'from-green-500 to-emerald-600'
  },
  [FILTER_TYPES.NEWEST]: {
    label: 'Newest',
    icon: Sparkles,
    description: 'Fresh ideas',
    color: 'from-purple-500 to-violet-600'
  },
  [FILTER_TYPES.OLDEST]: {
    label: 'Oldest',
    icon: Clock,
    description: 'Proven concepts',
    color: 'from-blue-500 to-cyan-600'
  }
};


export default function ProductGrid() {
  const { data: session, status } = useSession();
  
 
  
  const initialVisibleCount = 12;
  const incrementAmount = 12;
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
          orderBy: 'id',
          orderDirection: 'desc'
        };
        break;
      case FILTER_TYPES.OLDEST:
        options = {
          ...options,
          orderBy: 'id',
          orderDirection: 'asc'
        };
        break;
      case FILTER_TYPES.LOW_COMPETITION:
        options = {
          ...options,
          orderBy: 'id',
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
    setVisibleCount(initialVisibleCount);
  };
  
  const visibleProducts = products?.slice(0, visibleCount);
  const hasMoreToLoad = products?.length > visibleCount;
  
  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="relative py-20 border-b border-gray-800">
        <div className=" mx-auto ">
          <div className="text-center mb-12">
            {/* Updated daily badge */}
            <div className="inline-flex items-center gap-2 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-purple-300">Updated daily</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-none">
              Idea Archive
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We live by digging through trends, analyzing markets, and brainstorming so you don't have to stress about coming up with the next big idea. This Archive is updated every day.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{totalCount || '200+'}</div>
              <div className="text-sm text-gray-400">Total Ideas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">Daily</div>
              <div className="text-sm text-gray-400">New Updates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">5-10</div>
              <div className="text-sm text-gray-400">Ideas Weekly</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">Free</div>
              <div className="text-sm text-gray-400">To Browse</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto">
          {/* Filter Section */}
          <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-white">Filter Ideas</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(FILTER_CONFIG).map(([filterType, config]) => {
                const isActive = activeFilter === filterType;
                const IconComponent = config.icon;
                
                return (
                  <button
                    key={filterType}
                    onClick={() => handleFilterChange(filterType)}
                    className={`group relative p-4 rounded-xl border transition-all duration-300 ${
                      isActive
                        ? 'border-gray-500 bg-gray-800/80'
                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center ${isActive ? 'scale-110' : 'group-hover:scale-105'} transition-transform duration-200`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>
                          {config.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {config.description}
                        </div>
                      </div>
                    </div>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-12 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mx-auto mb-4 animate-pulse"></div>
              <p className="text-gray-400">Loading fresh ideas...</p>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="bg-gradient-to-b from-red-900/20 to-red-800/30 backdrop-blur-sm border border-red-700/50 rounded-2xl p-12 text-center">
              <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-red-400">!</span>
              </div>
              <p className="text-red-300 mb-4">Error loading ideas. Please try again.</p>
              <button 
                onClick={() => refetch()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          )}
          
          {/* Empty State */}
          {!loading && !error && visibleProducts?.length === 0 && (
            <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No ideas found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later for new ideas.</p>
            </div>
          )}
          
          {/* Ideas Grid */}
          {!loading && !error && visibleProducts?.length > 0 && (
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProducts.map((product, index) => {
                  const shouldBlur = !session && index > 4;
                  
                  return (
                    <div
                      key={product.id}
                      className={`${shouldBlur ? 'blur-sm pointer-events-none' : ''} transition-all duration-300`}
                    >
                      <ProductCard
                        title={product.title}
                        description={product.excerpt}
                        category={product.main_keyword}
                        accent={"#8B5CF6"}
                        id={product.id}
                        competition={product?.market_analysis?.competition_level}
                        createdAt={product.created_at}
                      />
                    </div>
                  );
                })}
              </div>
              
              {/* Load More Button */}
              {hasMoreToLoad && session && (
                <div className="mt-12 text-center">
                  <button 
                    onClick={handleLoadMore}
                    className="group bg-gradient-to-r from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 hover:border-gray-600 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center gap-3 mx-auto"
                  >
                    <span>Load More Ideas</span>
                    <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-200" />
                  </button>
                </div>
              )}
              
              {/* Signup Overlay for Non-authenticated Users */}
              {!session && (
                <div className="absolute inset-x-0 bottom-0">
                  <div className="bg-gradient-to-t from-gray-950 via-gray-950/95 to-transparent pt-20 pb-8 rounded-2xl">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Want to see more?
                      </h3>
                      <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        Sign up to explore our complete archive of SaaS ideas with demand and low barrier entry.
                      </p>
                      <Link href={'/api/auth/signIn'}>
                        <button 
                        className="group bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 mx-auto">
                          <span>Get Full Access</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Ideas Count Display */}
              <div className="mt-8 text-center">
                <p className="text-gray-500">
                  Showing {visibleProducts?.length} of {session ? totalCount : `10${totalCount > 10 ? '+' : ''}`} ideas
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}