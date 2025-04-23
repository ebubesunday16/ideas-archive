'use client'

import ThemeButton from '@/components/ThemeButton';
import { RocketLaunch } from '@/assets/svgs';
import { supabase } from '@/lib/supabaseClient';
import { IdeasType } from '@/types/idea';
import React, { useEffect, useState } from 'react';


export default function AdminInterface() {
  const [ideas, setIdeas] = useState<IdeasType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mainView, setMainView] = useState('add'); // 'ideas' or 'add'
  const [formTab, setFormTab] = useState('keywords'); // For the form tabs: 'basic', 'keywords', etc.
  const [formData, setFormData] = useState({
    // Main idea
    title: '',
    main_keyword: '',
    image_url: '',
    search_volume: '',
    headline: '',
    excerpt: '',
    
    // Keywords
    keywords: [{ keyword: '', volume: '', competition: 'low' }],
    
    // Notes
    notes: [{ title: '', content: '' }],
    
    // Market Analysis
    marketAnalysis: {
      search_volume: '',
      competition_level: 'Low',
      trend: 'Steady'
    },
    
    // Implementation Steps
    implementationSteps: [{ title: '', description: '', order_index: 0 }],
    
    // Competitors
    competitors: [{ name: '', url: '', traffic: '', traffic_share: 0, notes: '' }],
    
    // Monetization Potential
    monetizationPotential: {
      subscription_revenue: '',
      affiliate_revenue: '',
      certification_programs: '',
      enterprise_deals: '',
      integration_partnerships: '',
      ad_revenue: '',
      total_potential: ''
    },
    
    // Technical Specs
    technicalSpecs: {
      development_cost: '',
      timeline: '',
      maintenance_cost: '',
      tech_stack: ''
    }
  });
  
  useEffect(() => {
    fetchIdeas();
  }, []);

  


  async function fetchIdeas() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('fetch_complete_ideas');
      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      alert('Error fetching ideas. Check console for details.');
    } finally {
      setLoading(false);
    }
  }
  
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
        p_market_analysis: [formData.marketAnalysis],
        p_implementation_steps: formData.implementationSteps,
        p_competitors: formData.competitors,
        p_monetization_potential: [formData.monetizationPotential],
        p_technical_specs: [formData.technicalSpecs]
      });
      
      if (error) throw error;
      
      alert('Idea added successfully!');
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
    setFormData({
      title: '',
      main_keyword: '',
      image_url: '',
      search_volume: '',
      headline: '',
      excerpt: '',
      keywords: [{ keyword: '', volume: '', competition: 'low' }],
      notes: [{ title: '', content: '' }],
      marketAnalysis: {
        search_volume: '',
        competition_level: 'Low',
        trend: 'Steady'
      },
      implementationSteps: [{ title: '', description: '', order_index: 0 }],
      competitors: [{ name: '', url: '', traffic: '', traffic_share: 0, notes: '' }],
      monetizationPotential: {
        subscription_revenue: '',
        affiliate_revenue: '',
        certification_programs: '',
        enterprise_deals: '',
        integration_partnerships: '',
        ad_revenue: '',
        total_potential: ''
      },
      technicalSpecs: {
        development_cost: '',
        timeline: '',
        maintenance_cost: '',
        tech_stack: ''
      }
    });
    setFormTab('basic'); // Reset to the first tab
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
  function addItem(section) {
    const emptyItems = {
      keywords: { keyword: '', volume: '', competition: 'low' },
      notes: { title: '', content: '' },
      implementationSteps: { title: '', description: '', order_index: formData.implementationSteps.length },
      competitors: { name: '', url: '', traffic: '', traffic_share: 0, notes: '' }
    };
    
    setFormData({
      ...formData,
      [section]: [...formData[section], emptyItems[section]]
    });
  }
  
  // Remove item from array fields
  function removeItem(section, index) {
    const updatedItems = [...formData[section]];
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
      
      alert('Idea deleted successfully!');
      fetchIdeas(); // Refresh the ideas list
    } catch (error) {
      console.error('Error deleting idea:', error);
      alert('Error deleting idea. Check console for details.');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
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
              <button type="button" onClick={() => setFormTab('steps')} className={`px-4 py-2 font-medium ${formTab === 'steps' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Implementation</button>
              <button type="button" onClick={() => setFormTab('competitors')} className={`px-4 py-2 font-medium ${formTab === 'competitors' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Competitors</button>
              <button type="button" onClick={() => setFormTab('monetization')} className={`px-4 py-2 font-medium ${formTab === 'monetization' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Monetization</button>
              <button type="button" onClick={() => setFormTab('tech')} className={`px-4 py-2 font-medium ${formTab === 'tech' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Tech Specs</button>
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
                    value={formData.marketAnalysis.search_volume}
                    onChange={(e) => handleChange(e, 'marketAnalysis', null, 'search_volume')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Competition Level</label>
                  <select
                    value={formData.marketAnalysis.competition_level}
                    onChange={(e) => handleChange(e, 'marketAnalysis', null, 'competition_level')}
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
                    value={formData.marketAnalysis.trend}
                    onChange={(e) => handleChange(e, 'marketAnalysis', null, 'trend')}
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
            
            {/* Implementation Steps Form */}
            {formTab === 'steps' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Implementation Steps</h2>
                  <button
                    type="button"
                    onClick={() => addItem('implementationSteps')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Add Step
                  </button>
                </div>
                
                {formData.implementationSteps.map((step, index) => (
                  <div key={index} className="p-4 border rounded-md bg-gray-50 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Step #{index + 1}</h4>
                      {formData.implementationSteps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem('implementationSteps', index)}
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
                        value={step.title}
                        onChange={(e) => handleChange(e, 'implementationSteps', index, 'title')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={step.description}
                        onChange={(e) => handleChange(e, 'implementationSteps', index, 'description')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows="2"
                        required
                      />
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between pt-4">
                  <ThemeButton type="button" onClick={() => setFormTab('market')} className="bg-gray-200 text-gray-800">
                    Back
                  </ThemeButton>
                  <ThemeButton type="button" onClick={() => setFormTab('competitors')}>
                    Next: Competitors <RocketLaunch className="ml-2" />
                  </ThemeButton>
                </div>
              </div>
            )}
            
            {/* Competitors Form */}
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
                <h2 className="text-xl font-bold mb-4">Monetization Potential</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Revenue</label>
                  <input
                    type="text"
                    value={formData.monetizationPotential.subscription_revenue}
                    onChange={(e) => handleChange(e, 'monetizationPotential', null, 'subscription_revenue')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">Example: $85K-$120K/month</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Affiliate Revenue</label>
                  <input
                    type="text"
                    value={formData.monetizationPotential.affiliate_revenue}
                    onChange={(e) => handleChange(e, 'monetizationPotential', null, 'affiliate_revenue')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certification Programs</label>
                  <input
                    type="text"
                    value={formData.monetizationPotential.certification_programs}
                    onChange={(e) => handleChange(e, 'monetizationPotential', null, 'certification_programs')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enterprise Deals</label>
                  <input
                    type="text"
                    value={formData.monetizationPotential.enterprise_deals}
                    onChange={(e) => handleChange(e, 'monetizationPotential', null, 'enterprise_deals')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Integration Partnerships</label>
                  <input
                    type="text"
                    value={formData.monetizationPotential.integration_partnerships}
                    onChange={(e) => handleChange(e, 'monetizationPotential', null, 'integration_partnerships')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Revenue</label>
                  <input
                    type="text"
                    value={formData.monetizationPotential.ad_revenue}
                    onChange={(e) => handleChange(e, 'monetizationPotential', null, 'ad_revenue')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Potential</label>
                  <input
                    type="text"
                    value={formData.monetizationPotential.total_potential}
                    onChange={(e) => handleChange(e, 'monetizationPotential', null, 'total_potential')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="flex justify-between pt-4">
                  <ThemeButton type="button" onClick={() => setFormTab('competitors')} className="bg-gray-200 text-gray-800">
                    Back
                  </ThemeButton>
                  <ThemeButton type="button" onClick={() => setFormTab('tech')}>
                    Next: Technical Specs <RocketLaunch className="ml-2" />
                  </ThemeButton>
                </div>
              </div>
            )}
            
            {/* Technical Specs Form */}
            {formTab === 'tech' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Technical Specifications</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Development Cost</label>
                  <input
                    type="text"
                    value={formData.technicalSpecs.development_cost}
                    onChange={(e) => handleChange(e, 'technicalSpecs', null, 'development_cost')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Example: $80K-$120K</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                  <input
                    type="text"
                    value={formData.technicalSpecs.timeline}
                    onChange={(e) => handleChange(e, 'technicalSpecs', null, 'timeline')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Example: 4-6 months</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Cost</label>
                  <input
                    type="text"
                    value={formData.technicalSpecs.maintenance_cost}
                    onChange={(e) => handleChange(e, 'technicalSpecs', null, 'maintenance_cost')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                  <input
                    type="text"
                    value={formData.technicalSpecs.tech_stack}
                    onChange={(e) => handleChange(e, 'technicalSpecs', null, 'tech_stack')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Example: Next.js, Node.js, MongoDB, AWS S3</p>
                </div>
                
                <div className="flex justify-between pt-4">
                  <ThemeButton type="button" onClick={() => setFormTab('monetization')} className="bg-gray-200 text-gray-800">
                    Back
                  </ThemeButton>
                  <ThemeButton type="submit" className="bg-green-600">
                    Submit Idea <RocketLaunch className="ml-2" />
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