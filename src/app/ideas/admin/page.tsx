// app/admin/page.jsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import AdminInterface from '@/components/AdminInterface';
import ThemeButton from '@/components/ThemeButton';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    checkSession();
  }, []);
  
  async function checkSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    } catch (error) {
      console.error('Error checking session:', error);
      setLoading(false);
    }
  }
  
  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      setSession(data.session);
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      setSession(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }
  
  if (!session) {
    return (
      <AdminInterface />
        
    //   <div className="min-h-screen flex items-center justify-center bg-gray-50">
    //     <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
    //       <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          
    //       {error && (
    //         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
    //           {error}
    //         </div>
    //       )}
          
    //       <form onSubmit={handleLogin} className="space-y-4">
    //         <div>
    //           <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
    //           <input
    //             type="email"
    //             value={email}
    //             onChange={(e) => setEmail(e.target.value)}
    //             className="w-full px-3 py-2 border border-gray-300 rounded-md"
    //             required
    //           />
    //         </div>
            
    //         <div>
    //           <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
    //           <input
    //             type="password"
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //             className="w-full px-3 py-2 border border-gray-300 rounded-md"
    //             required
    //           />
    //         </div>
            
    //         <div>
    //           <ThemeButton type="submit" className="w-full">
    //             {loading ? 'Logging in...' : 'Login'}
    //           </ThemeButton>
    //         </div>
    //       </form>
          
    //       <div className="mt-6 text-center">
    //         <a href="/" className="text-blue-600 hover:text-blue-800">
    //           Back to Homepage
    //         </a>
    //       </div>
    //     </div>
    //   </div>
    );
  }
  
  return (
    <div>
      {/* <div className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Ideas Admin Portal</h1>
          <div className="flex items-center space-x-4">
            <span>{session.user.email}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div> */}
      
      <AdminInterface />
    </div>
  );
}