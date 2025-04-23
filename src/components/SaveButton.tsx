'use client'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { saveIdea, unsaveIdea } from '@/utils/usersFetch'; 
import { toast } from "sonner"


export default function SaveButton({ ideaId, initialSaved = false, className }) {
  const { status } = useSession();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleSave = async () => {
    if (status !== 'authenticated') {
      // Redirect to sign in or show sign-in modal
      toast("You'll need to Login.")
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        await unsaveIdea(ideaId);
      } else {
        await saveIdea(ideaId);
        console.log(ideaId)
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={isLoading || status !== 'authenticated'}
      className={`flex items-center border border-black text-sm mb-8 px-3 py-1 ${className} ${
        isSaved 
          ? 'bg-gray-100  hover:bg-[#F6BD41]' 
          : 'bg-gray-100 hover:bg-[#F6BD41]'
      }`}
    >
      { isLoading ? (
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