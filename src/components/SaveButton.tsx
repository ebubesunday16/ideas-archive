'use client'
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { saveIdea, unsaveIdea } from '@/utils/usersFetch'; 
import { toast } from "sonner"
<<<<<<< HEAD

=======
>>>>>>> parent of 35395c9 (Design Tweaks)


export default function SaveButton({ ideaId, initialSaved = false, className }) {
  const { status } = useSession();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
<<<<<<< HEAD
  
  
=======
>>>>>>> parent of 35395c9 (Design Tweaks)

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
<<<<<<< HEAD
        toast("Added to saved ideas");
=======
>>>>>>> parent of 35395c9 (Design Tweaks)
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setIsLoading(false);
    }
  return (
    <button
      onClick={handleToggleSave}
      disabled={isLoading || status !== 'authenticated'}
      className={`flex items-center border border-black shadow-[2px_2px_0_0_#333333] text-sm mb-8 px-3 py-1 hover:bg-gray-200 ${className} ${
        isSaved 
          ? 'bg-gray-100'  
          : 'bg-[#F6BD41]'
<<<<<<< HEAD
     
=======
>>>>>>> parent of 35395c9 (Design Tweaks)
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
}}