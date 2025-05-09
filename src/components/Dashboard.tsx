'use client';
import { IdeasType } from '@/types/idea';
import { getCurrentUser, getSavedIdeas, unsaveIdea } from '@/services/usersFetch';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [savedIdeas, setSavedIdeas] = useState<IdeasType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Collapsible sections state
  const [ideasOpen, setIdeasOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      if (status === 'authenticated') {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          
          const ideas = await getSavedIdeas();
          setSavedIdeas(ideas);
          
         
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setLoading(false);
        }
      } else if (status === 'unauthenticated') {
        setLoading(false);
      }
    }
    
    loadUserData();
  }, [status]);

  const handleRemoveIdea = async (ideaId) => {
    try {
      await unsaveIdea(ideaId);
      setSavedIdeas(savedIdeas.filter(idea => idea.id !== ideaId));
    } catch (error) {
      console.error('Error removing idea:', error);
    }
  };

  // Toggle section functions
  const toggleIdeasSection = () => setIdeasOpen(!ideasOpen);
  const toggleProfileSection = () => setProfileOpen(!profileOpen);
  const toggleStatsSection = () => setStatsOpen(!statsOpen);
  

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center ">
        <div className="min-h-screen px-4 py-2 bg-white border-2 border-gray-400 text-gray-800 font-mono">
          Loading...
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center p-8  ">
        <div className="p-6 max-w-md bg-white border-2 border-gray-400 shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 font-mono text-center">DASHBOARD</h1>
          <p className="text-center font-mono">Please sign in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  // Extract additional user information from session and user data
  const userImage = session.user.image || '/default-avatar.png';
  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString() 
    : 'Unknown';
  const lastLogin = user?.lastLogin 
    ? new Date(user?.lastLogin).toLocaleDateString() 
    : new Date().toLocaleDateString();

  return (
    <div className="border border-black pb-8">
      <div className="bg-gray-800 px-3 py-4 sm:px-8 mb-6">
        <div className=" mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-gray-300 font-mono text-sm">
              Welcome back, {session.user.name}
            </span>
          </div>
            <button 
              onClick={() => signOut()}
              className="bg-white text-gray-800 px-3 py-1 font-mono text-sm border border-gray-400 hover:bg-gray-200"
            >
              SIGN OUT
            </button>
        </div>
      </div>
      
      <div className="container mx-auto px-3 sm:px-8">
        {/* Navigation Tabs */}
        <div className="mb-6 flex border-b border-gray-400">
          <button 
            className={`px-4 py-2 font-mono text-sm ${activeTab === 'profile' ? 'bg-white border-t border-l border-r border-gray-400 -mb-px' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('profile')}
          >
            PROFILE
          </button>
          <button 
            className={`px-4 py-2 font-mono text-sm ${activeTab === 'ideas' ? 'bg-white border-t border-l border-r border-gray-400 -mb-px' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('ideas')}
          >
            SAVED IDEAS
          </button>
          
        </div>
        
        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="border border-gray-400 bg-white">
              <button
                onClick={toggleProfileSection}
                className="w-full flex items-center justify-between p-3 bg-gray-200 border-b border-gray-400 hover:bg-gray-300 transition-colors text-sm font-mono uppercase tracking-wider"
              >
                <span className="font-bold">User Profile</span>
                <span>{profileOpen ? '▲' : '▼'}</span>
              </button>
              
              {profileOpen && (
                <div className="p-4 md:flex gap-6">
                  <div className="md:w-1/4 flex flex-col items-center mb-4 md:mb-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 mb-2">
                      <img src={userImage} alt={session.user.name} className="w-full h-full object-cover" />
                    </div>
                    
                  </div>
                  
                  <div className="md:w-3/4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-mono text-xs text-gray-500 mb-1">FULL NAME</h3>
                        <p className="font-mono font-bold">{session.user.name}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-mono text-xs text-gray-500 mb-1">EMAIL</h3>
                        <p className="font-mono">{session.user.email}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-mono text-xs text-gray-500 mb-1">MEMBER SINCE</h3>
                        <p className="font-mono">{memberSince}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-mono text-xs text-gray-500 mb-1">LAST LOGIN</h3>
                        <p className="font-mono">{lastLogin}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-mono text-xs text-gray-500 mb-1">ACCOUNT TYPE</h3>
                        <p className="font-mono">{user?.accountType || 'Standard'}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-mono text-xs text-gray-500 mb-1">USERNAME</h3>
                        <p className="font-mono">@{user?.username || session.user.name.toLowerCase().replace(/\s/g, '')}</p>
                      </div>
                    </div>
                    
                    
                    
                    
                  </div>
                </div>
              )}
            </div>
            
           
          </div>
        )}
        
        {/* Saved Ideas Tab Content */}
        {activeTab === 'ideas' && (
          <div className="border border-gray-400">
            <button
              onClick={toggleIdeasSection}
              className="w-full flex items-center justify-between p-3 bg-gray-200 border-b border-gray-400 hover:bg-gray-300 transition-colors text-sm font-mono uppercase tracking-wider"
            >
              <span className="font-bold">Saved Ideas</span>
              <span>{ideasOpen ? '▲' : '▼'}</span>
            </button>
            
            {ideasOpen && (
              <div className="p-2 bg-white space-y-2">
                {savedIdeas.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 font-mono text-sm">
                    You haven't saved any ideas yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {savedIdeas.map(idea => (
                      <div key={idea.id} className="border border-gray-400 bg-white">
                        <div className="bg-gray-200 border-b border-gray-400 px-2 py-1">
                          <h3 className="font-mono font-bold text-sm">{idea.title}</h3>
                        </div>
                        <div className="p-2">
                          <p className="font-mono text-xs leading-relaxed mb-3 bg-gray-50 p-2 border border-gray-200">
                            {idea.excerpt}
                          </p>
                          <div className="flex justify-between items-center">
                            <button
                              className="bg-gray-800 text-white px-3 py-1 text-xs font-mono hover:bg-gray-700"
                              onClick={() => {/* Navigate to idea details */}}
                            >
                              VIEW
                            </button>
                            <button
                              className="bg-white text-gray-700 px-3 py-1 text-xs font-mono border border-gray-400 hover:bg-gray-100"
                              onClick={() => handleRemoveIdea(idea.id)}
                            >
                              REMOVE
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        
      </div>
    </div>
  );
}