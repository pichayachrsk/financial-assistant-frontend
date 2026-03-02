'use client';

import { Chat } from '@/components/Chat';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useConversations';
import { LayoutDashboard, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isInitialized } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  const router = useRouter();

  const { 
    data: conversations = [], 
    deleteConversation 
  } = useConversations(isAuthenticated);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteConversation(id);
      if (id === activeConversationId) {
        setActiveConversationId(undefined);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (!isInitialized || !isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <Sidebar 
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
        onDelete={handleDeleteConversation}
        onLogout={logout}
        user={user}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col p-4 sm:p-6 overflow-hidden">
        {/* Chat Component container */}
        <section className="flex-1 min-h-0 relative w-full h-full max-w-none">
          <Chat 
            conversationId={activeConversationId} 
            onNewConversation={(id) => setActiveConversationId(id)}
            onDelete={handleDeleteConversation}
          />
        </section>

        {/* Action Tips / Context Footer - Moved to background or hidden to save space */}
      </main>
    </div>
  );
}
