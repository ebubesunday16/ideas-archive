'use client'

import { saveIdea, unsaveIdea } from '@/services/usersFetch'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { toast } from 'sonner'

function SaveButton({className, ideaId}: {className: string, ideaId: number,}) {

    const [isSaved, setIsSaved] = useState(false)
    

    const { data: session, status } = useSession()

    
    const handleSave = async () => {

        if (status ==="unauthenticated"){
            toast("You need to Login!")
            return  
        }

        if (isSaved) {
            await unsaveIdea(ideaId)
            toast("Idea Removed")
            setIsSaved(false)
        } else {
            await saveIdea(ideaId)
            toast("Idea Saved")
            setIsSaved(true)
        }
    }

  return (
    <button 
    className={`flex items-center border border-black text-sm mb-8 px-3 py-1 bg-gray-100 ${className}`}
    onClick={() => handleSave()}
    >
        {isSaved ? (
            <span className='flex gap-1 items-center justify-center'>
            <span>Unsave</span>
            <BookmarkCheck strokeWidth={1}  size={18}/>
            </span>
            
        ): (
            <span className='flex gap-1 items-center justify-center'>
            <span>Save</span>
            <Bookmark strokeWidth={1} size={18} />
            </span>
        )}
        
        


    </button>
  )
}

export default SaveButton
