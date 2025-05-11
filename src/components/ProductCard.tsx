'use client'
import ThemeButton from "@/components/ThemeButton";
import { Sparkles, TrendingUp, Zap } from "lucide-react";
import Link from 'next/link';
import { useState } from 'react';

export default function ProductCard({
  title,
  description,
  category,
  competition,
  accent,
  id,
  className,
}: {title: string, description: string, category: string, accent: string, competition: string, id: string, className: string}) {
  const [isHovered, setIsHovered] = useState(false);


  const getCompetitionBadge = () => {
    if (!competition) return null;
    
    switch(competition.toLowerCase()) {
      case 'low':
        return (
          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 text-xs rounded-sm  ">
            <Zap className="h-3 w-3" />
            <span>Low</span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-sm">
            <TrendingUp className="h-3 w-3" />
            <span>Medium</span>
          </div>
        );
      case 'high':
        return (
          <div className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 text-xs rounded-sm">
            <Sparkles className="h-3 w-3" />
            <span>High</span>
          </div>
        );
      default:
        return null;
    }
  };

 
  return (
    <div
      className={`overflow-hidden border border-black bg-white hover:shadow-md transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="h-1 transition-all duration-300 group-hover:h-2"
        style={{ backgroundColor: accent }}
      ></div>
      
      <Link href={`/ideas/${id}`}>
        <div className="px-3 py-2 bg-gray-200 border-b border-gray-400">
          <div className="flex justify-between items-center">
            <h3 className="font-mono font-bold text-sm">{title}</h3>
            {competition && (
              <div className="text-xs font-mono px-2 py-1">
                {getCompetitionBadge()}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-3">
          <div className="mb-3">
            <span
              className="text-xs font-mono px-2 py-1 bg-gray-100 border border-gray-300 inline-block"
              style={{
                borderLeftColor: accent,
                borderLeftWidth: '3px'
              }}
            >
              {category}
            </span>
          </div>
          
          <p className="font-mono text-xs leading-relaxed mb-4 bg-gray-50 p-2 border border-gray-200">
            {description}
          </p>
          
          <div className="flex justify-between items-center">
            <ThemeButton className="bg-gray-800 text-white px-3 py-1 text-xs font-mono hover:bg-gray-700 border-none">
              VIEW DETAILS
            </ThemeButton>
            
            <div
              className={`transition-all duration-300 transform ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
            >
              <button
                className="text-xs font-mono flex items-center gap-1 text-gray-200"
                
              >
                PREVIEW
                <span className="transition-all duration-300 transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}