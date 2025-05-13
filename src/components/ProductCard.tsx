'use client'
import ThemeButton from "@/components/ThemeButton";
import { Bookmark, BookmarkCheck, Sparkles, TrendingUp, Zap } from "lucide-react";
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
  createdAt, // Add createdAt prop to track when the idea was created
}: {
  title: string, 
  description: string, 
  category: string, 
  accent: string, 
  competition: string, 
  id: string, 
  className: string,
  createdAt?: string, // Optional timestamp for when the idea was created
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
    e.preventDefault(); // Prevent navigation when clicking the bookmark
    e.stopPropagation(); // Stop event propagation
    
    // Check if user is authenticated
    if (status === "unauthenticated") {
      toast("You need to login to save ideas!");
      return;
    }
    
    setIsLoading(true);
    try {
      if (saved) {
        const result = await unsaveIdea(Number(id));
        if (result.success) {
          toast("Idea removed from saved collection");
          setSaved(false);
        } else {
          toast("Failed to remove idea. Please try again.");
        }
      } else {
        const result = await saveIdea(Number(id));
        if (result.success) {
          toast("Idea saved to your collection");
          setSaved(true);
        } else {
          toast("Failed to save idea. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
      toast("Something went wrong. Please try again.");
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

  const getCompetitionBadge = () => {
    if (!competition) return null;
   
    switch(competition.toLowerCase()) {
      case 'low':
        return (
          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 text-xs rounded-sm">
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
      className={`overflow-hidden flex flex-col border border-black bg-white hover:shadow-md transition-all duration-300 ${className} relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* New badge - only appears if the idea is less than a week old */}
      {isNewIdea() && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs font-mono font-bold z-10 shadow-sm transform rotate-0 translate-y-0 translate-x-0">
          NEW
        </div>
      )}
      
      <div
        className="h-1 transition-all duration-300 group-hover:h-2"
        style={{ backgroundColor: accent }}
      ></div>
     
      <div className="px-3 py-2 bg-gray-200 border-b border-gray-400">
        <div className="flex justify-between items-center">
          <Link href={`/ideas/${id}`} className="flex-1">
            <h3 className="font-mono font-bold text-sm line-clamp-2 hover:underline">{title}</h3>
          </Link>
          <div className="flex items-center gap-2">
            {competition && (
              <div className="text-xs font-mono">
                {getCompetitionBadge()}
              </div>
            )}
            <button 
              onClick={handleSaveToggle}
              className="p-1 rounded-sm hover:bg-gray-300 transition-colors"
              aria-label={saved ? "Unsave idea" : "Save idea"}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-gray-800 border-t-transparent rounded-full"></div>
              ) : saved ? (
                <BookmarkCheck className="h-4 w-4 fill-gray-800 text-gray-800" />
              ) : (
                <Bookmark className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>
     
      <Link href={`/ideas/${id}`} className="flex-1">
        <div className="p-3 h-full flex flex-col">
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
         
          <p className="font-mono text-xs leading-relaxed mb-4 bg-gray-50 p-2 border border-gray-200 line-clamp-3">
            {description}
          </p>
         
          <div className="flex justify-between items-center mt-auto">
            <ThemeButton className="bg-gray-800 text-white px-3 py-1 text-xs font-mono hover:bg-gray-700 border-none">
              VIEW DETAILS
            </ThemeButton>
           
            <div
              className={`transition-all duration-300 transform ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
            >
              <button
                className="text-xs font-mono flex items-center gap-1 text-gray-500 hover:text-gray-800"
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