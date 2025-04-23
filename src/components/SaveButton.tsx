'use client'

import { useState, useEffect } from 'react';
import { saveIdea, unsaveIdea } from '@/utils/usersFetch';
import { toast } from "sonner";

export default function SaveButton({ ideaId, initialSaved = false, className }) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if idea is saved in localStorage on component mount
  useEffect(() => {
    const checkIfSaved = () => {
      if (typeof window !== 'undefined') {
        const savedIdeasStr = localStorage.getItem('savedIdeas') || '[]';
        const savedIdeas = JSON.parse(savedIdeasStr);
        setIsSaved(savedIdeas.includes(ideaId));
      }
    };
    
    checkIfSaved();
  }, [ideaId]);

  const handleToggleSave = async () => {
    setIsLoading(true);
    try {
      if (isSaved) {
        await unsaveIdea(ideaId);
        toast("Removed from saved ideas");
      } else {
        await saveIdea(ideaId);
        toast("Added to saved ideas");
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling save:', error);
      toast("Failed to save idea");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={isLoading}
      className={`flex items-center border border-black text-sm mb-8 px-3 py-1 hover:bg-gray-200 ${className} ${
        isSaved ? 'bg-gray-100' : 'bg-[#F6BD41]'
      }`}
    >
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill={isSaved ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          {isSaved ? 'Saved' : 'Save'}
        </>
      )}
    </button>
  );
}