'use client'
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Idea, IdeaQueryOptions, UseIdeasDataResult } from "@/ideas";

export const useIdeasData = (options: IdeaQueryOptions = {}): UseIdeasDataResult => {
    const { 
      ideaId = null, 
      limit = 10, 
      page = 0, 
      searchTerm = '',
      orderBy = 'title', 
      orderDirection = 'asc' 
    } = options;
    
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);
    

    const fetchIdeas = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        
        let query = supabase
          .from('idea_complete_view')
          .select('*', { count: 'exact' });
        
        if (ideaId !== null) {
          query = query.eq('id', ideaId);
        }
        
        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,main_keyword.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`);
        }
        
        if (limit > 0) {
          const startIndex = page * limit;
          query = query
            .order(orderBy, { ascending: orderDirection === 'asc' })
            .range(startIndex, startIndex + limit - 1);
        }
        
        const { data, error: supabaseError, count } = await query;

        
        if (supabaseError) throw new Error(supabaseError.message);
        
        setIdeas(data as Idea[] || []);
        setTotalCount(count || 0);
      } catch (err) {
        console.error('Error fetching ideas:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchIdeas();
    }, [ideaId, limit, page, searchTerm, orderBy, orderDirection]);
  
    return { ideas, loading, error, totalCount, refetch: fetchIdeas };
  };
  