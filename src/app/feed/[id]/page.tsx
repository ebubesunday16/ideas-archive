import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Zap, Star } from 'lucide-react';
import { getSortedFeeds, getFeedById } from '@/lib/feed';
import type { FeedItem } from '@/types/feed';
import { notFound } from 'next/navigation';
import { signIn } from 'next-auth/react';

interface FeedDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const feeds = getSortedFeeds();
  return feeds.map((feed) => ({
    id: feed.id,
  }));
}

async function getFeedData(id: string) {
  const feed = await getFeedById(id);
  
  if (!feed) {
    return { feed: null, relatedFeeds: [] };
  }
  
  const allFeeds = getSortedFeeds();
  const relatedFeeds = allFeeds
    .filter(item => item.category === feed.category && item.id !== feed.id)
    .slice(0, 3);
  
  return { feed, relatedFeeds };
}

export default async function FeedDetailPage({ params }: FeedDetailPageProps) {
  const { id } = params;
  const { feed, relatedFeeds } = await getFeedData(id);
  
  if (!feed) {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Back Button */}
      <Link 
        href="/feed"
        className="group inline-flex items-center mb-12 text-gray-400 hover:text-white transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
        Back to all feeds
      </Link>
      
      {/* Main Content */}
      <div className="bg-gradient-to-b from-gray-900/50 to-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
        {feed.coverImage && (
          <div className="relative h-64 w-full md:h-96">
            <Image 
              src={feed.coverImage} 
              alt={feed.title} 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        )}
        
        <div className="p-6 md:p-8 lg:p-12">
          {/* Category & Tags */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-1.5">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-xs font-medium text-purple-300">{feed.category}</span>
            </div>
            {feed.tags?.map(tag => (
              <div key={tag} className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-3 py-1">
                <span className="text-xs font-medium text-gray-300">#{tag}</span>
              </div>
            ))}
          </div>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            {feed.title}
          </h1>
          
          {/* Author & Date */}
          <div className="flex items-center gap-6 mb-8">
            {feed.author && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                <span className="text-gray-400">By {feed.author}</span>
              </div>
            )}
            <span className="text-gray-500">{feed.date}</span>
          </div>
          
          {/* Content */}
          <div 
            className="prose prose-invert max-w-none prose-lg text-gray-300"
            dangerouslySetInnerHTML={{ __html: feed.contentHtml || '' }}
          />
        </div>
      </div>
      
      {/* Related Feeds */}
      {relatedFeeds.length > 0 && (
        <div className="mt-24">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              More in {feed.category}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedFeeds.map(relatedFeed => (
              <div 
                key={relatedFeed.id} 
                className="group bg-gradient-to-b from-gray-900/50 to-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-300"
              >
                {relatedFeed.coverImage && (
                  <div className="relative h-48 w-full">
                    <Image 
                      src={relatedFeed.coverImage} 
                      alt={relatedFeed.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{relatedFeed.title}</h3>
                  <Link 
                    href={`/feed/${relatedFeed.id}`}
                    className="group/link inline-flex items-center gap-1 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-300 hover:to-blue-300 transition-all"
                  >
                    Read more
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-32 text-center">
        <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Want more insights like this?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            We analyze trends daily to bring you the most valuable opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={'/api/auth/signin'} className="group bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            
            >
              Subscribe to updates
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link 
              href="/feed"
              className="border border-gray-600 text-gray-300 px-8 py-4 rounded-full font-medium hover:border-gray-500 hover:text-white transition-all duration-200 flex items-center gap-2"
            >
              <Star className="w-4 h-4 text-yellow-400" />
              Browse all feeds
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-static';
export const revalidate = 60;