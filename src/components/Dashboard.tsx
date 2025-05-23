'use client';
import { getCurrentUser, getSavedIdeas, unsaveIdea } from '@/services/usersFetch';
import { IdeasType } from '@/types/idea';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { User, Heart, TrendingUp, Calendar, Mail, Shield, Bookmark, Eye, Trash2, LogOut } from 'lucide-react';

// Skeleton loader component with modern dark theme
const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 px-2 py-6 animate-pulse">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="h-6 bg-gray-700 rounded w-48"></div>
          <div className="h-10 bg-gray-700 rounded-full w-24"></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 animate-pulse">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-6"></div>
                <div className="h-6 bg-gray-700 rounded w-32 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-40 mx-auto mb-8"></div>
              </div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-700 rounded"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-700 rounded w-20 mb-1"></div>
                      <div className="h-4 bg-gray-700 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Content Area Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-32 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <div className="h-12 bg-gray-700 rounded w-12 mb-4"></div>
                    <div className="h-8 bg-gray-700 rounded w-16 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Ideas Skeleton */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-32 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <div className="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="h-16 bg-gray-700 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-8 bg-gray-700 rounded w-16"></div>
                      <div className="h-8 bg-gray-700 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [savedIdeas, setSavedIdeas] = useState<IdeasType[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (status === 'loading' || loading) {
    return <SkeletonLoader />;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-2 py-6">
        <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Access Required</h1>
          <p className="text-gray-400 mb-6">Please sign in to view your dashboard and saved ideas.</p>
          <button className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-200">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Extract user information
  const userImage = session.user.image || '/default-avatar.png';
  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString() 
    : 'Unknown';
  const lastLogin = user?.lastLogin 
    ? new Date(user?.lastLogin).toLocaleDateString() 
    : new Date().toLocaleDateString();

  // Mock stats - replace with real data
  const stats = [
    { label: 'Saved Ideas', value: savedIdeas.length, icon: Heart, color: 'from-red-500 to-pink-500' },
    { label: 'Views This Month', value: '2.4k', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { label: 'Days Active', value: '89', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
    { label: 'Account Level', value: 'Pro', icon: Shield, color: 'from-purple-500 to-violet-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300 font-medium">
                Welcome back, {session.user.name}
              </span>
            </div>
            <button 
              onClick={() => signOut()}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-all duration-200 border border-gray-700 hover:border-gray-600"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 sticky top-24">
              <div className="text-center mb-8">
                <div className="relative inline-block mb-4">
                  <img 
                    src={userImage} 
                    alt={session.user.name} 
                    className="w-24 h-24 rounded-full border-2 border-gray-600"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <h2 className="text-xl font-semibold text-white mb-1">{session.user.name}</h2>
                <p className="text-gray-400 text-sm">@{user?.username || session.user.name.toLowerCase().replace(/\s/g, '')}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-medium">{session.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Member Since</p>
                    <p className="text-sm font-medium">{memberSince}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Last Login</p>
                    <p className="text-sm font-medium">{lastLogin}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Account Type</p>
                    <p className="text-sm font-medium">{user?.accountType || 'Standard'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Section */}
            <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Dashboard Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Ideas Section */}
            <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Bookmark className="w-5 h-5" />
                  Saved Ideas
                </h3>
                {savedIdeas.length > 0 && (
                  <span className="text-sm text-gray-400">
                    {savedIdeas.length} idea{savedIdeas.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {savedIdeas.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-gray-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-300 mb-2">No saved ideas yet</h4>
                  <p className="text-gray-500 mb-6">Start exploring and save ideas that inspire you.</p>
                  <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-200">
                    Browse Ideas
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedIdeas.map(idea => (
                    <div key={idea.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-300 group">
                      <h4 className="font-semibold text-white mb-3 group-hover:text-gray-100 transition-colors">
                        {idea.title}
                      </h4>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {idea.excerpt}
                      </p>
                      <div className="flex justify-between items-center">
                        <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-all duration-200">
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleRemoveIdea(idea.id)}
                          className="flex items-center gap-2 bg-gray-700 text-gray-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-600 hover:text-white transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}