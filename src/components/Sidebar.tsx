'use client';

import { Conversation, User } from '@/types';
import {
	ChevronRight,
	LogOut,
	MessageSquare,
	Plus,
	Trash2,
	TrendingUp
} from 'lucide-react';
import React from 'react';

interface SidebarProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string | undefined) => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
  onLogout: () => void;
  user: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  conversations, 
  activeId, 
  onSelect, 
  onDelete,
  onLogout, 
  user 
}) => {
  return (
    <aside className="w-80 bg-slate-900/50 border-r border-slate-900/80 p-6 flex flex-col backdrop-blur-3xl shadow-2xl relative z-10 transition-all duration-300">
      <div className="flex items-center gap-3 mb-10 px-2 group cursor-default">
         <div className="p-2.5 bg-indigo-600 rounded-xl shadow-xl shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-500 ease-out">
          <TrendingUp size={24} strokeWidth={2.5} className="text-white" />
         </div>
         <span className="text-xl font-black tracking-tight text-white/90">
           FINBOT <span className="text-indigo-500">AI</span>
         </span>
      </div>

      <button 
        onClick={() => onSelect(undefined)}
        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl mb-8 flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95 border border-slate-700/50 group"
      >
        <div className="p-1 bg-indigo-600/20 rounded-md group-hover:bg-indigo-600 transition-colors">
          <Plus size={18} />
        </div>
        New Analysis
      </button>

      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
        <div className="space-y-1.5">
           <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase pl-3 mb-3">Core Engine</h3>
           <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-indigo-600/10 shadow-xl border border-indigo-500/20">
                 <MessageSquare size={18} />
                 <span>Market Advisor</span>
                 <ChevronRight size={14} className="ml-auto opacity-40" />
              </button>
           </nav>
        </div>

        <div className="space-y-1.5">
           <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase pl-3 mb-3">Recent Inquiries</h3>
           <div className="space-y-1 px-1">
             {conversations.map((conv) => (
               <button
                 key={conv.id}
                 onClick={() => onSelect(conv.id)}
                 className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all group flex items-center justify-between ${
                   activeId === conv.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/60'
                 }`}
               >
                 <div className="flex items-center gap-2.5 truncate">
                    <MessageSquare size={16} className={`${activeId === conv.id ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`} />
                    <span className="truncate">{conv.title || 'Untitled Chat'}</span>
                 </div>

                 {onDelete && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(conv.id, e);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </div>
                 )}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-900/80 space-y-4">
         <div className="flex items-center gap-3 px-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-900/30 border border-slate-800 flex items-center justify-center text-indigo-400 font-black">
               {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-bold truncate">{user?.username || 'Trader'}</p>
               <p className="text-[10px] text-slate-500 font-black tracking-tighter uppercase truncate">{user?.email || 'Active Session'}</p>
            </div>
         </div>

         <div className="flex gap-2">
            <button
              onClick={onLogout}
              className="flex-1 flex items-center justify-center p-3 rounded-xl bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-500 transition-all shadow-sm group"
            >
               <LogOut size={18} />
            </button>
         </div>
      </div>
    </aside>
  );
};
