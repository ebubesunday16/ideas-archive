'use client'
import ThemeButton from "@/components/ThemeButton";
import { Bookmark, BookmarkCheck, Sparkles, TrendingUp, Zap, ArrowRight, Eye } from "lucide-react";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { saveIdea, unsaveIdea, isIdeaSaved } from "@/services/usersFetch";
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function ProductCard({
  title,
  description,
  category,
  competition,
  accent,
  id,
  className,
  createdAt,
}: {
  title: string, 
  description: string, 
  category: string, 
  accent: string, 
  competition: string, 
  id: string, 
  className: string,
  createdAt?: string,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  
  // Check if idea is saved on component mount
  useEffect(() => {
    setSaved(isIdeaSaved(Number(id)));
  }, [id]);
  
  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (status === "unauthenticated") {
      toast("You need to login to save ideas!");
      return;
    }
    
    setIsLoading(true);
    try {
      if (saved) {
        const result = await unsaveIdea(Number(id));
        if (result.success) {
          toast("Idea removed from collection");
          setSaved(false);
        } else {
          toast("Failed to remove idea");
        }
      } else {
        const result = await saveIdea(Number(id));
        if (result.success) {
          toast("Idea saved to collection");
          setSaved(true);
        } else {
          toast("Failed to save idea");
        }
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
      toast("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if the idea is new (less than a week old)
  const isNewIdea = () => {
    if (!createdAt) return false;
    
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7);
    
    return createdDate > oneWeekAgo;
  };

  const getCompetitionConfig = () => {
    if (!competition) return null;
   
    switch(competition.toLowerCase()) {
      case 'low':
        return {
          icon: Zap,
          label: 'Low Competition',
          color: 'from-green-500 to-emerald-500',
          textColor: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20'
        };
      case 'medium':
        return {
          icon: TrendingUp,
          label: 'Medium Competition',
          color: 'from-yellow-500 to-orange-500',
          textColor: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20'
        };
      case 'high':
        return {
          icon: Sparkles,
          label: 'High Competition',
          color: 'from-red-500 to-pink-500',
          textColor: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20'
        };
      default:
        return null;
    }
  };

  const competitionConfig = getCompetitionConfig();
 
  return (
    <div
      className={`group bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-all duration-300 ${className} relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* New badge */}
      {isNewIdea() && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            New
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <Link href={`/ideas/${id}`} className="flex-1 group-hover:text-white transition-colors">
            <h3 className="font-semibold text-gray-200 line-clamp-2 leading-tight">
              {title}
            </h3>
          </Link>
          
          <button 
            onClick={handleSaveToggle}
            className="p-2 rounded-lg hover:bg-gray-700 transition-all duration-200 flex-shrink-0"
            aria-label={saved ? "Unsave idea" : "Save idea"}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-gray-300 rounded-full"></div>
            ) : saved ? (
              <BookmarkCheck className="h-4 w-4 text-purple-400" />
            ) : (
              <Bookmark className="h-4 w-4 text-gray-500 hover:text-gray-300 transition-colors" />
            )}
          </button>
        </div>

        {/* Category and Competition */}
        <div className="flex items-center gap-3 mb-4">
          {/* Category */}
          <div className="bg-gray-700/50 border border-gray-600 px-3 py-1 rounded-full">
            <span className="text-xs text-gray-300 font-medium">
              {category}
            </span>
          </div>
          
          {/* Competition Badge */}
          {competitionConfig && (
            <div className={`flex items-center gap-1 ${competitionConfig.bgColor} ${competitionConfig.borderColor} border px-2 py-1 rounded-full`}>
              <competitionConfig.icon className={`h-3 w-3 ${competitionConfig.textColor}`} />
              <span className={`text-xs ${competitionConfig.textColor} font-medium`}>
                {competition}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <Link href={`/ideas/${id}`} className="block px-6 pb-6">
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">
          {description}
        </p>
        
        {/* Action Area */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-300 group-hover:text-white transition-colors">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">View Details</span>
          </div>
          
          <div className={`flex items-center gap-1 text-gray-500 transition-all duration-300 ${
            isHovered ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
          }`}>
            <span className="text-xs">Explore</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </Link>

      
    </div>
  );
}