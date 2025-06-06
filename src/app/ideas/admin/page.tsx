'use client'

import AdminInterface from '@/components/AdminInterface';
import { useState } from 'react';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
 
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }
  
  return (
    <div>
      <AdminInterface />
    </div>
  );
}