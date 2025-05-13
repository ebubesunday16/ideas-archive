'use client'
import { saveIdea, unsaveIdea, isIdeaSaved } from '@/services/usersFetch'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'

function SaveButton({className, ideaId}: {className: string, ideaId: number}) {
    const [isSaved, setIsSaved] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { data: session, status } = useSession()
    
    // Check if idea is already saved when component mounts
    useEffect(() => {
        setIsSaved(isIdeaSaved(ideaId))
    }, [ideaId])
   
    const handleSave = async () => {
        if (status === "unauthenticated") {
            toast("You need to login to save ideas!")
            return  
        }
        
        setIsLoading(true)
        try {
            if (isSaved) {
                const result = await unsaveIdea(ideaId)
                if (result.success) {
                    toast("Idea removed from your collection")
                    setIsSaved(false)
                } else {
                    toast("Failed to remove idea. Please try again.")
                }
            } else {
                const result = await saveIdea(ideaId)
                if (result.success) {
                    toast("Idea saved to your collection")
                    setIsSaved(true)
                } else {
                    toast("Failed to save idea. Please try again.")
                }
            }
        } catch (error) {
            console.error('Error toggling saved status:', error)
            toast("Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <button
            className={`flex items-center border border-black text-sm mb-8 px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
            onClick={handleSave}
            disabled={isLoading}
        >
            {isLoading ? (
                <span className='flex gap-1 items-center justify-center'>
                    <span>Processing...</span>
                    <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></div>
                </span>
            ) : isSaved ? (
                <span className='flex gap-1 items-center justify-center'>
                    <span>Unsave</span>
                    <BookmarkCheck strokeWidth={1} size={18}/>
                </span>
            ) : (
                <span className='flex gap-1 items-center justify-center'>
                    <span>Save</span>
                    <Bookmark strokeWidth={1} size={18} />
                </span>
            )}
        </button>
    )
}
    
    return (
        <button
            className={`flex items-center border border-black text-sm mb-8 px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
            onClick={handleSave}
            disabled={isLoading}
        >
            {isLoading ? (
                <span className='flex gap-1 items-center justify-center'>
                    <span>Processing...</span>
                    <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></div>
                </span>
            ) : isSaved ? (
                <span className='flex gap-1 items-center justify-center'>
                    <span>Unsave</span>
                    <BookmarkCheck strokeWidth={1} size={18}/>
                </span>
            ) : (
                <span className='flex gap-1 items-center justify-center'>
                    <span>Save</span>
                    <Bookmark strokeWidth={1} size={18} />
                </span>
            )}
        </button>
    )
}

export default SaveButton