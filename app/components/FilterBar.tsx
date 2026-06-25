// app/components/FilterBar.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Briefcase, User, LayoutGrid } from 'lucide-react';

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCat = searchParams.get('cat') || 'all';

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) params.set('q', e.target.value);
    else params.delete('q');
    router.replace(`/?${params.toString()}`);
  };

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat !== 'all') params.set('cat', cat);
    else params.delete('cat');
    router.replace(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          onChange={handleSearch} 
          defaultValue={searchParams.get('q') || ''} 
          placeholder="Buscar demandas por título ou detalhes..." 
          className="w-full bg-slate-900/60 border border-slate-700/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 outline-none transition-all shadow-inner placeholder:text-slate-600" 
        />
      </div>
      <div className="flex gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/50 shadow-inner overflow-x-auto">
        <button onClick={() => setCategory('all')} className={`px-4 py-1.5 text-xs font-bold rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${currentCat === 'all' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
          <LayoutGrid size={14}/> Tudo
        </button>
        <button onClick={() => setCategory('trabalho')} className={`px-4 py-1.5 text-xs font-bold rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${currentCat === 'trabalho' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow' : 'text-slate-400 hover:text-indigo-300'}`}>
          <Briefcase size={14}/> Trabalho
        </button>
        <button onClick={() => setCategory('pessoal')} className={`px-4 py-1.5 text-xs font-bold rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${currentCat === 'pessoal' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow' : 'text-slate-400 hover:text-emerald-300'}`}>
          <User size={14}/> Pessoal
        </button>
      </div>
    </div>
  );
}