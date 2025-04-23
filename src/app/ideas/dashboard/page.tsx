// app/dashboard/page.jsx
import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Dashboard from "@/components/Dashboard";

export default async function DashboardPage() {
  // Server-side authentication check
  const session = await getServerSession(authOptions);
  
  // If no session exists, redirect to signin
  if (!session) {
    redirect('/api/auth/signin');
  }
  
  // If session exists, render the Dashboard component
  // Note: Not passing session as Dashboard uses useSession() internally
  return <Dashboard />;
}