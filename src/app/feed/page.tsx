import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, Star } from 'lucide-react';
import { getCategorisedFeeds } from '@/lib/feed';
import type { FeedItem } from '@/types/feed';

interface FeedCardProps {
  feed: FeedItem;
}

export const FeedCard: React.FC<FeedCardProps> = ({ feed }) => {
  return (
    <div className="group bg-gradient-to-b from-gray-900/50 to-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      {feed.coverImage && (
        <div className="relative h-48 w-full">
          <Image 
            src={feed.coverImage} 
            alt={feed.title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      <div className="p-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-3 py-1 mb-3">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          <span className="text-xs font-medium text-purple-300">{feed.category}</span>
        </div>
        <h3 className="text-xl font-bold mb-3 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          {feed.title}
        </h3>
        {feed.excerpt && (
          <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">{feed.excerpt}</p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{feed.date}</span>
          <Link 
            href={`/feed/${feed.id}`}
            className="group flex items-center gap-1 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-300 hover:to-blue-300 transition-all"
          >
            Read more
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default async function FeedPage() {
  const categorisedFeeds = getCategorisedFeeds();
  const categories = Object.keys(categorisedFeeds);
  
  return (
    <div className="container mx-auto px-6 py-20 z-10">
      {/* Hero Section */}
      <section className="mb-20 text-center z-10">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-300">Updated weekly</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-tight">
          Feed Collection
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Curated insights, trends, and opportunities to keep you ahead of the curve.
        </p>
      </section>

      {categories.length === 0 ? (
        <div className="text-center py-20 border border-gray-800 rounded-2xl bg-gradient-to-b from-gray-900/30 to-gray-900/70">
          <p className="text-gray-400 text-lg">No feed items available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-16">
          {categories.map((category) => (
            <section key={category} className="border-b border-gray-800 pb-16 last:border-0">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                  {category}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorisedFeeds[category].map((feed) => (
                  <FeedCard key={feed.id} feed={feed} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* CTA Section */}
      <section className="mt-32 text-center">
        <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Want more curated insights?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            We analyze trends daily to bring you the most valuable opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-2">
              Subscribe to updates
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button className="border border-gray-600 text-gray-300 px-8 py-4 rounded-full font-medium hover:border-gray-500 hover:text-white transition-all duration-200 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              Browse featured
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export const dynamic = 'force-static';
export const revalidate = 60; // Revalidate the page every 60 seconds