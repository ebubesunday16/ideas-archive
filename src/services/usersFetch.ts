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
  if (typeof window === 'undefined') return { error: 'Not in browser context' };
  
  const savedIdeasStr = localStorage.getItem('savedIdeas') || '[]';
  const savedIdeas = JSON.parse(savedIdeasStr);
  
  const updatedIdeas = savedIdeas.filter((id: number) => id !== ideaId);
  localStorage.setItem('savedIdeas', JSON.stringify(updatedIdeas));
  
  return { success: true };
}
 
// Get user's saved ideas
export async function getSavedIdeas() {
  if (typeof window === 'undefined') return [];
  
  const savedIdeasStr = localStorage.getItem('savedIdeas') || '[]';
  const savedIdsArray  = JSON.parse(savedIdeasStr);

  const {ideas:resolvedIdeas, error} = await getIdeasServerSide()

  const savedIdeas = resolvedIdeas?.filter((item) => savedIdsArray.includes(item.id))

  return savedIdeas
}