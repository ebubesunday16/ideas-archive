'use client'

import { RocketLaunch } from '@/assets/svgs';
import ThemeButton from '@/components/ThemeButton';
import { Idea as IdeaType } from '@/ideas';
import { supabase } from '@/lib/supabaseClient';
import { useIdeasData } from '@/services/useIdeasData';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from "sonner";


export default function EditIdeaAdmin() {
  const router = useRouter();
  const params = useParams();
  const ideaId = params.id;
  
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [formTab, setFormTab] = useState('basic'); 

  
  
  //Initialize the form
  const [formData, setFormData] = useState<IdeaType>({
    title: '',
    main_keyword: '',
    image_url: '',
    search_volume: '',
    headline: '',
    excerpt: '',
    
    keywords: [{ keyword: '', volume: '', competition: 'low' }],
    notes: [{ title: '', content: '' }],
    
    market_analysis: {
      search_volume: '',
      competition_level: 'Low',
      trend: 'Steady'
    },
    
    monetization_potentials: [{
      title: '',
      content: ''
    }],
    competitors: [{
      name: '',
      url: '',
      traffic: '',
      traffic_share: 1,
      notes: '',
    }]
  });

  const { ideas, loading: ideasLoading, error } = useIdeasData(
    ideaId ? { ideaId: Number(ideaId) } : {}
  );

  useEffect(() => {
    if (error) {
      setNotFound(true);
      setLoading(false);
    } else if (!ideasLoading && ideas.length > 0) {
      populateForm(ideas[0]);
      setLoading(false);
    } else if (!ideasLoading && ideas.length === 0 && ideaId) {
      setNotFound(true);
      setLoading(false);
    }
  }, [ideas, ideasLoading, error, ideaId]);

  

  //retrieves form data from database
  function populateForm(ideaData: IdeaType) {
    if (!ideaData) return;
      setFormData({
        title: ideaData.title || '',
        main_keyword: ideaData.main_keyword || '',
        image_url: ideaData.image_url || '',
        search_volume: ideaData.search_volume || '',
        headline: ideaData.headline || '',
        excerpt: ideaData.excerpt || '',
      
        keywords: ideaData.keywords.length > 0
          ? ideaData.keywords.map((kw: any) => ({
              keyword: kw.keyword || '',
              volume: kw.volume || '',
              competition: kw.competition || 'low'
            }))
          : [{ keyword: '', volume: '', competition: 'low' }],
      
        notes: ideaData.notes.length > 0
          ? ideaData.notes.map((note: any) => ({
              title: note.title || '',
              content: note.content || ''
            }))
          : [{ title: '', content: '' }],
      
        market_analysis: {
          search_volume: ideaData.market_analysis?.search_volume || '',
          competition_level: ideaData.market_analysis?.competition_level || 'Low',
          trend: ideaData.market_analysis?.trend || 'Increasing'
        },
      
        competitors: ideaData.competitors.length > 0
          ? ideaData.competitors.map((comp: any) => ({
              name: comp.name || '',
              url: comp.url || '',
              traffic: comp.traffic || '',
              traffic_share: comp.traffic_share || 0,
              notes: comp.notes || ''
            }))
          : [{ name: '', url: '', traffic: '', traffic_share: 0, notes: '' }],
      
          monetization_potentials: ideaData.monetization_potentials.length > 0 ? ideaData.monetization_potentials.map((mon) => ({
            title: mon.title || '',
            content: mon.content || ''
          })) : [{title: '', content: ''}],
      
      });
      
  }
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Prepare the data for the RPC call
      const ideaData = {
        title: formData.title,
        main_keyword: formData.main_keyword,
        image_url: formData.image_url,
        search_volume: formData.search_volume,
        headline: formData.headline,
        excerpt: formData.excerpt
      };
      
      const keywords = formData.keywords.map(kw => ({
        keyword: kw.keyword,
        volume: kw.volume,
        competition: kw.competition
      }));
      
      const notes = formData.notes.map(note => ({
        title: note.title,
        content: note.content
      }));
      
      const marketAnalysis = {
        search_volume: formData.market_analysis.search_volume,
        competition_level: formData.market_analysis.competition_level,
        trend: formData.market_analysis.trend
      };
      
      const competitors = formData.competitors.map(comp => ({
        name: comp.name,
        url: comp.url,
        traffic: comp.traffic,
        traffic_share: comp.traffic_share,
        notes: comp.notes
      }));
      
      const monetizationPotential = formData.monetization_potentials.map((mon) => ({
        title: mon.title,
        content: mon.content
      }));
      
      const { data, error } = await supabase.rpc('update_complete_idea_data', {
        p_idea_id: Number(ideaId),
        p_idea_data: ideaData,
        p_keywords: keywords,
        p_notes: notes,
        p_market_analysis: marketAnalysis,
        p_competitors: competitors,
        p_monetization_potential: monetizationPotential
      });
      
      if (error) {
        console.error('Error updating idea:', error);
        toast.error('Failed to update idea');
        return;
      }
      
      toast.success('Idea updated successfully');
      router.push('/ideas');
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section?: string, index?: number, field?: string) {
    const { name, value } = e.target;
   
    if (section) {
      if (Array.isArray(formData[section as keyof Idea])) {
        // Handle array fields (keywords, notes, monetization_potentials, etc.)
        const updatedItems = [...(formData[section as keyof Idea] as any[])];
        if (field) {
          updatedItems[index as number] = {
            ...updatedItems[index as number],
            [field]: value
          };
        } else {
          updatedItems[index as number] = {
            ...updatedItems[index as number],
            [name]: value
          };
        }
        setFormData({ ...formData, [section]: updatedItems });
      } else if (typeof formData[section as keyof Idea] === 'object') {
        // Handle nested objects (market_analysis, etc.)
        setFormData({
          ...formData,
          [section]: {
            ...(formData[section as keyof Idea] as object),
            [field || name]: value
          }
        });
      }
    } else {
      // Handle top-level fields
      setFormData({ ...formData, [name]: value });
    }
  }
  
  // Add new item to array fields
  function addItem(section: string) {
    const emptyItems: Record<string, any> = {
      keywords: { keyword: '', volume: '', competition: 'low' },
      notes: { title: '', content: '' },
      monetization_potentials: { title: '', content: '' },
      competitors: { name: '', url: '', traffic: '', traffic_share: 0, notes: '' }
    };
   
    if (section in emptyItems) {
      setFormData({
        ...formData,
        [section]: [...(formData[section as keyof Idea] as any[]), emptyItems[section]]
      });
    }
  }
  
  // Remove item from array fields
  function removeItem(section: string, index: number) {
    const updatedItems = [...(formData[section as keyof Idea] as any[])];
    updatedItems.splice(index, 1);
    setFormData({ ...formData, [section]: updatedItems });
  }

  if (notFound) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Idea not found.</span>
          <button 
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push('/admin')}
          >
            Back to Admin
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Idea #{ideaId}</h1>
        <ThemeButton onClick={() => router.push('/admin')} className="bg-gray-200 text-gray-800">
          Back to Dashboard
        </ThemeButton>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            {/* Tab navigation */}
            <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
              <button
                type="button"
                onClick={() => setFormTab('basic')}
                className={`px-3 py-1 rounded-t-md ${formTab === 'basic' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Basic Info
              </button>
              <button
                type="button"
                onClick={() => setFormTab('keywords')}
                className={`px-3 py-1 rounded-t-md ${formTab === 'keywords' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Keywords
              </button>
              <button
                type="button"
                onClick={() => setFormTab('notes')}
                className={`px-3 py-1 rounded-t-md ${formTab === 'notes' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Notes
              </button>
              <button
                type="button"
                onClick={() => setFormTab('market')}
                className={`px-3 py-1 rounded-t-md ${formTab === 'market' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Market Analysis
              </button>
              
              <button
                type="button"
                onClick={() => setFormTab('competitors')}
                className={`px-3 py-1 rounded-t-md ${formTab === 'competitors' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Competitors
              </button>
              <button
                type="button"
                onClick={() => setFormTab('monetization')}
                className={`px-3 py-1 rounded-t-md ${formTab === 'monetization' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Monetization
              </button>
             
            </div>
            
            {/* Basic Info Form */}
            {formTab === 'basic' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Main Keyword</label>
                  <input
                    type="text"
                    name="main_keyword"
                    value={formData.main_keyword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Volume</label>
                  <input
                    type="text"
                    name="search_volume"
                    value={formData.search_volume}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                  <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <ThemeButton type="button" onClick={() => setFormTab('keywords')}>
                    Next: Keywords <RocketLaunch className="ml-2" />
                  </ThemeButton>
                </div>
              </div>
            )}
            
            {/* Keywords Form */}
            {formTab === 'keywords' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Keywords</h2>
                  <button
                    type="button"
                    onClick={() => addItem('keywords')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Add Keyword
                  </button>
                </div>
                
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className="p-4 border rounded-md bg-gray-50 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Keyword #{index + 1}</h4>
                      {formData.keywords.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem('keywords', index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
                        <input
                          type="text"
                          value={keyword.keyword}
                          onChange={(e) => handleChange(e, 'keywords', index, 'keyword')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Volume</label>
                        <input
                          type="text"
                          value={keyword.volume}
                          onChange={(e) => handleChange(e, 'keywords', index, 'volume')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Competition</label>
                        <select
                          value={keyword.competition}
                          onChange={(e) => handleChange(e, 'keywords', index, 'competition')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between pt-4">
                  <ThemeButton type="button" onClick={() => setFormTab('basic')} className="bg-gray-200 text-gray-800">
                    Back
                  </ThemeButton>
                  <ThemeButton type="button" onClick={() => setFormTab('notes')}>
                    Next: Notes <RocketLaunch className="ml-2" />
                  </ThemeButton>
                </div>
              </div>
            )}
            
            {/* Notes Form */}
            {formTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Notes</h2>
                  <button
                    type="button"
                    onClick={() => addItem('notes')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Add Note
                  </button>
                </div>
                
                {formData.notes.map((note, index) => (
                  <div key={index} className="p-4 border rounded-md bg-gray-50 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Note #{index + 1}</h4>
                      {formData.notes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem('notes', index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={note.title}
                        onChange={(e) => handleChange(e, 'notes', index, 'title')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea
                        value={note.content}
                        onChange={(e) => handleChange(e, 'notes', index, 'content')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between pt-4">
                  <ThemeButton type="button" onClick={() => setFormTab('keywords')} className="bg-gray-200 text-gray-800">
                    Back
                  </ThemeButton>
                  <ThemeButton type="button" onClick={() => setFormTab('market')}>
                    Next: Market Analysis <RocketLaunch className="ml-2" />
                  </ThemeButton>
                </div>
              </div>
            )}
            
            {/* Market Analysis Form */}
            {formTab === 'market' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Market Analysis</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Volume</label>
                  <input
                    type="text"
                    value={formData.market_analysis.search_volume}
                    onChange={(e) => handleChange(e, 'market_analysis', null, 'search_volume')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Competition Level</label>
                  <select
                    value={formData.market_analysis.competition_level}
                    onChange={(e) => handleChange(e, 'market_analysis', null, 'competition_level')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trend</label>
                  <select
                    value={formData.market_analysis.trend}
                    onChange={(e) => handleChange(e, 'market_analysis', null, 'trend')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="Steady">Steady</option>
                    <option value="Upward">Upward</option>
                    <option value="Rapid growth">Rapid growth</option>
                    <option value="Downward">Downward</option>
                  </select>
                </div>
                
                <div className="flex justify-between pt-4">
                  <ThemeButton type="button" onClick={() => setFormTab('notes')} className="bg-gray-200 text-gray-800">
                    Back
                  </ThemeButton>
                  <ThemeButton type="button" onClick={() => setFormTab('steps')}>
                    Next: Implementation Steps <RocketLaunch className="ml-2" />
                  </ThemeButton>
                </div>
              </div>
            )}
            
            {/* Competitors Form */}
            {formTab === 'competitors' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Competitors</h2>
                  <button
                    type="button"
                    onClick={() => addItem('competitors')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Add Competitor
                  </button>
                </div>
                
                {formData.competitors.map((competitor, index) => (
                  <div key={index} className="p-4 border rounded-md bg-gray-50 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Competitor #{index + 1}</h4>
                    {formData.competitors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem('competitors', index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={competitor.name}
                        onChange={(e) => handleChange(e, 'competitors', index, 'name')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                      <input
                        type="url"
                        value={competitor.url}
                        onChange={(e) => handleChange(e, 'competitors', index, 'url')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Traffic</label>
                      <input
                        type="text"
                        value={competitor.traffic}
                        onChange={(e) => handleChange(e, 'competitors', index, 'traffic')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Traffic Share (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={competitor.traffic_share}
                        onChange={(e) => handleChange(e, 'competitors', index, 'traffic_share')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={competitor.notes}
                      onChange={(e) => handleChange(e, 'competitors', index, 'notes')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between pt-4">
                <ThemeButton type="button" onClick={() => setFormTab('steps')} className="bg-gray-200 text-gray-800">
                  Back
                </ThemeButton>
                <ThemeButton type="button" onClick={() => setFormTab('monetization')}>
                  Next: Monetization <RocketLaunch className="ml-2" />
                </ThemeButton>
              </div>
            </div>
          )}
          
          {/* Monetization Potential Form */}
          {formTab === 'monetization' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Monetization Potential</h2>
                <button
                  type="button"
                  onClick={() => addItem('monetization_potentials')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Add Monetization Strategy
                </button>
              </div>
              
              {formData.monetization_potentials.map((monetization, index) => (
                <div key={index} className="p-4 border rounded-md bg-gray-50 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Strategy #{index + 1}</h4>
                    {formData.monetization_potentials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem('monetization_potentials', index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={monetization.title}
                      onChange={(e) => handleChange(e, 'monetization_potentials', index, 'title')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={monetization.content}
                      onChange={(e) => handleChange(e, 'monetization_potentials', index, 'content')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              ))}
    
    <div className="flex justify-between pt-4">
      <ThemeButton type="button" onClick={() => setFormTab('competitors')} className="bg-gray-200 text-gray-800">
        Back
      </ThemeButton>
      <ThemeButton type="submit">
        Submit <RocketLaunch className="ml-2" />
      </ThemeButton>
    </div>
  </div>
          )}
          
          
          
          {/* Submit button at the bottom */}
          <div className="mt-8 pt-4 border-t">
            <ThemeButton type="submit" className="w-full bg-green-500 hover:bg-green-600">
              Save All Changes
            </ThemeButton>
          </div>
        </form>
      </div>
    )}
  </div>
);
}