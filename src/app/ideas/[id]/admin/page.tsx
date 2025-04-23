'use client'

import ThemeButton from '@/components/ThemeButton';
import { RocketLaunch } from '@/assets/svgs';
import { supabase } from '@/lib/supabaseClient';
import { IdeasType } from '@/types/idea';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function EditIdeaAdmin() {
  const router = useRouter();
  const params = useParams();
  const ideaId = params.id;
  
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [formTab, setFormTab] = useState('basic'); // For the form tabs: 'basic', 'keywords', etc.
  
  const [formData, setFormData] = useState<IdeasType>({
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
  
  useEffect(() => {
    if (ideaId) {
      fetchIdeaData(Number(ideaId));
    }
  }, [ideaId]);

  async function fetchIdeaData(id: number) {
    try {
      setLoading(true);
      
      // Fetch main idea data
      const { data, error: ideaError } = await supabase.rpc('get_complete_idea_data', { idea_id: id });

      if (ideaError) {
        console.error('Error fetching idea data:', ideaError);
        throw ideaError;
      }

      const ideaData = data as IdeasType;
      console.log(ideaData);

      if (!ideaData) {
        setNotFound(true);
        return;
      }

      // Set form data from fetched data
      setFormData({
        title: ideaData.title || '',
        main_keyword: ideaData.main_keyword || '',
        image_url: ideaData.image_url || '',
        search_volume: ideaData.search_volume || '',
        headline: ideaData.headline || '',
        excerpt: ideaData.excerpt || '',
      
        keywords: Array.isArray(ideaData.keywords) && ideaData.keywords.length > 0
          ? ideaData.keywords.map((kw: any) => ({
              keyword: kw.keyword || '',
              volume: kw.volume || '',
              competition: kw.competition || 'low'
            }))
          : [{ keyword: '', volume: '', competition: 'low' }],
      
        notes: Array.isArray(ideaData.notes) && ideaData.notes.length > 0
          ? ideaData.notes.map((note: any) => ({
              title: note.title || '',
              content: note.content || ''
            }))
          : [{ title: '', content: '' }],
      
        marketAnalysis: {
          search_volume: ideaData.market_analysis?.search_volume || '',
          competition_level: ideaData.market_analysis?.competition_level || 'Low',
          trend: ideaData.market_analysis?.trend || 'Steady'
        },
      
        implementationSteps: Array.isArray(ideaData.implementation_steps) && ideaData.implementation_steps.length > 0
          ? ideaData.implementation_steps.map((step: any) => ({
              title: step.title || '',
              description: step.description || '',
              order_index: step.order_index || 0
            }))
          : [{ title: '', description: '', order_index: 0 }],
      
        competitors: Array.isArray(ideaData.competitors) && ideaData.competitors.length > 0
          ? ideaData.competitors.map((comp: any) => ({
              name: comp.name || '',
              url: comp.url || '',
              traffic: comp.traffic || '',
              traffic_share: comp.traffic_share || 0,
              notes: comp.notes || ''
            }))
          : [{ name: '', url: '', traffic: '', traffic_share: 0, notes: '' }],
      
        monetizationPotential: {
          subscription_revenue: ideaData.monetization_potential?.subscription_revenue || '',
          affiliate_revenue: ideaData.monetization_potential?.affiliate_revenue || '',
          certification_programs: ideaData.monetization_potential?.certification_programs || '',
          enterprise_deals: ideaData.monetization_potential?.enterprise_deals || '',
          integration_partnerships: ideaData.monetization_potential?.integration_partnerships || '',
          ad_revenue: ideaData.monetization_potential?.ad_revenue || '',
          total_potential: ideaData.monetization_potential?.total_potential || ''
        },
      
        technicalSpecs: {
          development_cost: ideaData.technical_specs?.development_cost || '',
          timeline: ideaData.technical_specs?.timeline || '',
          maintenance_cost: ideaData.technical_specs?.maintenance_cost || '',
          tech_stack: ideaData.technical_specs?.tech_stack || ''
        }
      });
      
    } catch (error) {
      console.error('Error fetching idea data:', error);
      alert('Error fetching idea data. Check console for details.');
    } finally {
      setLoading(false);
    }
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
      
      // Fix: use marketAnalysis instead of market_analysis
      const marketAnalysis = {
        search_volume: formData.marketAnalysis.search_volume,
        competition_level: formData.marketAnalysis.competition_level,
        trend: formData.marketAnalysis.trend
      };
      
      const implementationSteps = formData.implementationSteps.map((step, index) => ({
        title: step.title,
        description: step.description,
        order_index: index
      }));
      
      const competitors = formData.competitors.map(comp => ({
        name: comp.name,
        url: comp.url,
        traffic: comp.traffic,
        traffic_share: comp.traffic_share,
        notes: comp.notes
      }));
      
      // Fix: use monetizationPotential instead of monetization_potential
      const monetizationPotential = {
        subscription_revenue: formData.monetizationPotential.subscription_revenue,
        affiliate_revenue: formData.monetizationPotential.affiliate_revenue,
        certification_programs: formData.monetizationPotential.certification_programs,
        enterprise_deals: formData.monetizationPotential.enterprise_deals,
        integration_partnerships: formData.monetizationPotential.integration_partnerships,
        ad_revenue: formData.monetizationPotential.ad_revenue,
        total_potential: formData.monetizationPotential.total_potential
      };
      
      // Fix: use technicalSpecs instead of technical_specs
      const technicalSpecs = {
        development_cost: formData.technicalSpecs.development_cost,
        timeline: formData.technicalSpecs.timeline,
        maintenance_cost: formData.technicalSpecs.maintenance_cost,
        tech_stack: formData.technicalSpecs.tech_stack
      };
      
      // Single RPC call to update everything in one transaction
      const { data, error } = await supabase.rpc('update_complete_idea_data', {
        p_idea_id: Number(ideaId),
        p_idea_data: ideaData,
        p_keywords: keywords,
        p_notes: notes,
        p_market_analysis: marketAnalysis, // Fixed parameter name
        p_implementation_steps: implementationSteps,
        p_competitors: competitors,
        p_monetization_potential: monetizationPotential, // Fixed parameter name
        p_technical_specs: technicalSpecs // Fixed parameter name
      });
      
      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      
      alert('Idea updated successfully!');
      router.push('/ideas/admin');
    } catch (error) {
      console.error('Error updating idea:', error);
      alert('Error updating idea. Check console for details.');
    } finally {
      setLoading(false);
    }
  }
  
  // Handle form input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section?: string, index?: number, field?: string) {
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
  function removeItem(section: string, index: number) {
    const updatedItems = [...formData[section]];
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
    <div className="container mx-auto py-8 px-4">
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
                onClick={() => setFormTab('steps')}
                className={`px-3 py-1 rounded-t-md ${formTab === 'steps' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Implementation
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
              <button
                type="button"
                onClick={() => setFormTab('technical')}
                className={`px-3 py-1 rounded-t-md ${formTab === 'technical' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Technical
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
                        rows={3}
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
              <h2 className="text-xl font-bold mb-4">Monetization Potential</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Revenue</label>
                  <input
                    type="text"
                    value={formData.monetizationPotential.subscription_revenue}
                    onChange={(e) => handleChange(e, 'monetizationPotential', null, 'subscription_revenue')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                <ThemeButton type="button" onClick={() => setFormTab('technical')}>
                  Next: Technical Specs <RocketLaunch className="ml-2" />
                </ThemeButton>
              </div>
            </div>
          )}
          
          {/* Technical Specs Form */}
          {formTab === 'technical' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Technical Specifications</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Development Cost</label>
                  <input
                    type="text"
                    value={formData.technicalSpecs.development_cost}
                    onChange={(e) => handleChange(e, 'technicalSpecs', null, 'development_cost')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
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
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <ThemeButton type="button" onClick={() => setFormTab('monetization')} className="bg-gray-200 text-gray-800">
                  Back
                </ThemeButton>
                <ThemeButton type="submit" className="bg-green-500 hover:bg-green-600">
                  Save All Changes
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