import { Idea, IdeaQueryOptions } from "@/ideas";
import { supabase } from "@/lib/supabaseClient";

export async function getIdeasServerSide({ 
    limit = 10, 
    page = 0, 
    searchTerm = '',
    orderBy = 'title', 
    orderDirection = 'asc' 
  }: Omit<IdeaQueryOptions, 'ideaId'>): Promise<{
    ideas: Idea[];
    totalCount: number;
    error: string | null;
  }> {
    try {
      const startIndex = page * limit;
      
      let query = supabase
        .from('idea_complete_view')
        .select('*', { count: 'exact' });
      
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,main_keyword.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`);
      }
      
      query = query
        .order(orderBy, { ascending: orderDirection === 'asc' })
        .range(startIndex, startIndex + limit - 1);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return { 
        ideas: data || [], 
        totalCount: count || 0,
        error: null 
      };
    } catch (error) {
      console.error('Error fetching ideas server-side:', error);
      return { 
        ideas: [], 
        totalCount: 0,
        error: error instanceof Error ? error.message: 'Unknown error' 
      };
    }
  }
  
  export async function getIdeaByIdServerSide(id: number): Promise<{ 
    idea: Idea | null;
    error: string | null;
  }>{
    try {
      const { data, error } = await supabase
        .from('idea_complete_view')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { 
        idea: data, 
        error: null 
      };
    } catch (error) {
      console.error('Error fetching idea server-side:', error);
      return { 
        idea: null, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  // Search ideas by keyword (server-side)
  export async function searchIdeasByKeywordServerSide(keyword: string): Promise<{
    ideas: Idea[] | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await supabaseServer
        .from('idea_complete_view')
        .select('*')
        .or(`main_keyword.ilike.%${keyword}%,keywords.ilike.%${keyword}%`);
      
      if (error) throw error;
      
      return { 
        ideas: data || [], 
        error: null 
      };
    } catch (error) {
      console.error('Error searching ideas server-side:', error);
      return { 
        ideas: [], 
        error: error instanceof Error? error.message : "Unknown error"
      };
    }
  }
  