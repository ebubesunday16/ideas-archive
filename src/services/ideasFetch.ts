import { supabase } from "@/lib/supabaseClient";
import { IdeasType } from "@/types/idea";





export async function fetchIdeaData(slug: number): Promise<IdeasType | null> {
    const { data, error } = await supabase
      .rpc('get_idea_data', { p_slug: slug });
      
    if (error) {
      console.error('Error fetching idea data:', error);
      throw error;
    }
    if (!data) return null;
    return data;
  }

  export async function getIdeas() {
    
    const isLocalStorageAvailable = () => {
      try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        return false;
      }
    };
  
    // Try to get data from localStorage first
    if (isLocalStorageAvailable()) {
      try {
        const cachedData = localStorage.getItem('cachedIdeas');
        
        if (cachedData) {
          const parsedData: IdeasType[] = JSON.parse(cachedData);
          console.log(`I'm using parsed data`)
          
          return parsedData;
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        // Continue to fetch from API if localStorage read fails
      }
    }
  
    // If localStorage is not available or no valid data found, fetch from API
    const ideasData = await fetchAllIdeas();
    console.log(`I'm using db data`)

    
    if (ideasData && isLocalStorageAvailable()) {
      try {
        localStorage.setItem('cachedIdeas', JSON.stringify(ideasData));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        // Continue even if caching fails
      }
    }
    return ideasData;
  }
  
  
  export async function fetchAllIdeas() {
    const {data, error}: { data: IdeasType[] | null, error: any} = await supabase.rpc('fetch_complete_ideas');
    if (error) {
      console.error('Error fetching ideas');
      throw error;
    }
    console.log(data);
    if (!data) return null;
    return data;
  }