export interface Keyword {
    id?: number;
    keyword: string;
    volume: string;
    competition: string;
  }
  
  export interface Competitor {
    id?: number;
    name: string;
    url: string;
    traffic: string;
    traffic_share: number;
    notes?: string;
  }
  
  export interface Note {
    id?: number;
    title: string;
    content: string;
  }
  
  export interface MarketAnalysis {
    id?: number;
    search_volume: string;
    competition_level: string;
    trend: string;
  }
  
  export interface MonetizationPotential {
    id?: number;
    title: string;
    content: string;
  }
  
  export interface Idea {
    id?: number;
    title: string;
    main_keyword: string;
    image_url?: string;
    search_volume: string;
    headline: string;
    excerpt: string;
    keywords: Keyword[];
    competitors: Competitor[];
    notes: Note[];
    market_analysis: MarketAnalysis;
    monetization_potentials: MonetizationPotential[];
  }
  
  export interface IdeaQueryOptions {
    ideaId?: number | null;
    limit?: number;
    page?: number;
    searchTerm?: string;
    orderBy?: keyof Idea;
    orderDirection?: 'asc' | 'desc';
  }
  
  export interface UseIdeasDataResult {
    ideas: Idea[];
    loading: boolean;
    error: Error | null;
    totalCount: number;
    refetch: () => Promise<void>;
  }