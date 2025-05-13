// Updated usersFetch.js with new isIdeaSaved function

import { supabase } from "@/lib/supabaseClient";
import { getSession } from "next-auth/react";
import { getIdeasServerSide } from "./IdeasDataServer";

// Get current user data
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user?.email) return null;
   
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', session.user.email)
    .single();
   
  return data;
}
 
export async function saveIdea(ideaId: number) {
  // Get current saved ideas from localStorage or initialize empty array
  const savedIdeasStr = localStorage.getItem('savedIdeas') || '[]';
  const savedIdeas = JSON.parse(savedIdeasStr);
 
  // Add the new idea if it's not already saved
  if (!savedIdeas.includes(ideaId)) {
    savedIdeas.push(ideaId);
    localStorage.setItem('savedIdeas', JSON.stringify(savedIdeas));
  }
 
  return { success: true };
}
 
export async function unsaveIdea(ideaId: number) {
  const savedIdeasStr = localStorage.getItem('savedIdeas') || '[]';
  const savedIdeas = JSON.parse(savedIdeasStr);
 
  const updatedIdeas = savedIdeas.filter((id: number) => id !== ideaId);
  localStorage.setItem('savedIdeas', JSON.stringify(updatedIdeas));
 
  return { success: true };
}

// New function to check if an idea is saved
export function isIdeaSaved(ideaId: number): boolean {
  if (typeof window === 'undefined') return false; // Handle server-side rendering
  
  try {
    const savedIdeasStr = localStorage.getItem('savedIdeas') || '[]';
    const savedIdeas = JSON.parse(savedIdeasStr);
    return savedIdeas.includes(ideaId);
  } catch (error) {
    console.error('Error checking if idea is saved:', error);
    return false;
  }
}
 
// Get user's saved ideas
export async function getSavedIdeas() {
  if (typeof window === 'undefined') return []; // Avoid server-side access to localStorage
 
  const savedIdeasStr = localStorage.getItem('savedIdeas') || '[]'; // Default to '[]' if no saved ideas
  const savedIdsArray = JSON.parse(savedIdeasStr);
  try {
    const { ideas: resolvedIdeas = [], error } = await getIdeasServerSide({});
    if (error) {
      console.error('Error fetching ideas:', error);
      return []; // Return empty array if there's an error
    }
    const savedIdeas = resolvedIdeas.filter((item) => savedIdsArray.includes(item.id));
    return savedIdeas;
  } catch (error) {
    console.error('Error in getSavedIdeas function:', error);
    return []; // Return empty array if any error occurs
  }
}