'use client'

import ThemeButton from '@/components/ThemeButton';
import { RocketLaunch } from '@/assets/svgs';
import { supabase } from '@/lib/supabaseClient';
import React, { useEffect, useState } from 'react';
import { useIdeasData } from '@/services/useIdeasData';
import { Idea as IdeaType } from '@/ideas';
import { toast } from 'sonner';

const formInitialize = {
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
}

export default function AdminInterface() {
  const [loading, setLoading] = useState<boolean>(true);
  const [mainView, setMainView] = useState('add'); 
  const [formTab, setFormTab] = useState('basic'); 
  const [formData, setFormData] = useState(formInitialize);
  
  
  const { ideas, loading: ideasLoading, error, refetch: fetchIdeas } = useIdeasData();

  useEffect(() => {
    if (error) {
      setLoading(false);
    } else if (!ideasLoading && ideas.length > 0) {
      setLoading(false);
    } 
  
  }, [ideas, ideasLoading, error]);
  

  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Prepare data for RPC call
      const { data, error } = await supabase.rpc('create_complete_idea', {
        p_title: formData.title,
        p_main_keyword: formData.main_keyword,
        p_image_url: formData.image_url,
        p_search_volume: formData.search_volume,
        p_headline: formData.headline,
        p_excerpt: formData.excerpt,
        p_keywords: formData.keywords,
        p_notes: formData.notes,
        p_market_analysis: formData.market_analysis,
        p_competitors: formData.competitors,
        p_monetization_potential: formData.monetization_potentials,
      });
      
      if (error) throw error;
      
      toast('Idea added successfully!');
      resetForm();
      fetchIdeas();
      setMainView('ideas');
    } catch (error) {
      console.error('Error adding idea:', error);
      alert('Error adding idea. Check console for details.');
    } finally {
      setLoading(false);
    }
  }
  
  function resetForm() {
    setFormData(formInitialize);
    setFormTab('basic'); 
  }
  
  // Handle form input changes
  function handleChange(e, section, index, field) {
    const { name, value } = e.target;
    
    if (section) {
      if (Array.isArray(formData[section])) {
        // Handle array fields (keywords, notes, etc.)
        const updatedItems = [...formData[section]];
        if (field) {
          updatedItems[index] = {
            ...updatedItems[index],
            [field]: value
          };
        } else {
          updatedItems[index] = {
            ...updatedItems[index],
            [name]: value
          };
        }
        setFormData({ ...formData, [section]: updatedItems });
      } else if (typeof formData[section] === 'object') {
        // Handle nested objects (marketAnalysis, etc.)
        setFormData({
          ...formData,
          [section]: {
            ...formData[section],
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
  
  // Delete an idea
  async function deleteIdea(id) {
    if (!confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('delete_complete_idea', {
        p_idea_id: id
      });
      
      if (error) throw error;
      
      toast('Idea deleted successfully!');
      fetchIdeas(); 
    } catch (error) {
      console.error('Error deleting idea:', error);
      alert('Error deleting idea. Check console for details.');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="container mx-auto py-8 px-4 text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ideas Admin Dashboard</h1>
        <div className="flex space-x-4">
          <ThemeButton
            onClick={() => setMainView('ideas')}
            className={mainView === 'ideas' ? 'bg-blue-600' : 'bg-gray-200 text-gray-800'}
          >
            View Ideas
          </ThemeButton>
          <ThemeButton
            onClick={() => {
              setMainView('add');
              setFormTab('basic'); // Reset to first tab when switching to add mode
            }}
            className={mainView === 'add' ? 'bg-blue-600' : 'bg-gray-200 text-gray-800'}
          >
            Add New Idea
          </ThemeButton>
        </div>
      </div>
      
      {loading && <div className="text-center py-8">Loading...</div>}
      
      {!loading && mainView === 'ideas' && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className='overflow-x-auto'>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Search Vol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ideas.map((idea) => (
                <tr key={idea.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idea.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idea.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idea.main_keyword}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idea.search_volume}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href={`/ideas/${idea.id}/admin`} target="_blank" className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</a>
                    <button onClick={() => deleteIdea(idea.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
              {ideas.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No ideas found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {!loading && mainView === 'add' && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            {/* Multi-step form with tabs */}
            <div className="flex border-b mb-6 overflow-x-auto">
              <button type="button" onClick={() => setFormTab('basic')} className={`px-4 py-2 font-medium ${formTab === 'basic' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Basic Info</button>
              <button type="button" onClick={() => setFormTab('keywords')} className={`px-4 py-2 font-medium ${formTab === 'keywords' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Keywords</button>
              <button type="button" onClick={() => setFormTab('notes')} className={`px-4 py-2 font-medium ${formTab === 'notes' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Notes</button>
              <button type="button" onClick={() => setFormTab('market')} className={`px-4 py-2 font-medium ${formTab === 'market' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Market Analysis</button>
              
              <button type="button" onClick={() => setFormTab('competitors')} className={`px-4 py-2 font-medium ${formTab === 'competitors' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Competitors</button>
              <button type="button" onClick={() => setFormTab('monetization')} className={`px-4 py-2 font-medium ${formTab === 'monetization' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Monetization</button>
              
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
                    rows="3"
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
                        rows="3"
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
                  <ThemeButton type="button" onClick={() => setFormTab('competitors')}>
                    Next: Competitors <RocketLaunch className="ml-2" />
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
                          type="text"
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
                        rows="2"
                        required
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
        Next: Submit <RocketLaunch className="ml-2" />
      </ThemeButton>
    </div>
  </div>
          )}
            
            
          </form>
        </div>
      )}
    </div>
  );
}