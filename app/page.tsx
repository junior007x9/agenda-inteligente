// app/page.tsx
import Link from 'next/link';
import { Suspense } from 'react';
import { getDashboardData } from './actions';
import { Briefcase, User, Calendar, CheckSquare, Sparkles } from 'lucide-react';
import { UserButton } from "@clerk/nextjs";
import PushNotification from './components/PushNotification';
import NotificationSettings from './components/NotificationSettings';
import DemandForm from './components/DemandForm';
import { TaskCard, MeetingCard } from './components/DemandCards';
import FilterBar from './components/FilterBar';
import InstallPrompt from './components/InstallPrompt'; // <-- NOVO IMPORT

export default async function DashboardPage({ searchParams }: { searchParams: { q?: string, cat?: string } }) {
  const { tasks, meetings } = await getDashboardData();

  const query = searchParams.q?.toLowerCase() || '';
  const category = searchParams.cat || 'all';

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(query) || (t.description?.toLowerCase().includes(query) ?? false);
    const matchesCat = category === 'all' || t.category === category;
    return matchesSearch && matchesCat;
  });

  const filteredMeetings = meetings.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(query) || (m.description?.toLowerCase().includes(query) ?? false);
    const matchesCat = category === 'all' || m.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 font-sans p-4 md:p-8 pb-32 relative">
      
      {/* NOSSO BANNER FLUTUANTE DE INSTALAÇÃO MÁGICA */}
      <InstallPrompt />

      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="text-purple-400 animate-pulse" size={28} /> Agenda Inteligente
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">Seu ecossistema exclusivo para demandas.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-3 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-2 rounded-2xl shadow-xl shadow-black/20">
            <span className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5 shadow-inner">
              <Briefcase size={14} /> Trabalho: {tasks.filter(t => t.category === 'trabalho').length + meetings.filter(m => m.category === 'trabalho').length}
            </span>
            <span className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 shadow-inner">
              <User size={14} /> Pessoal: {tasks.filter(t => t.category === 'pessoal').length + meetings.filter(m => m.category === 'pessoal').length}
            </span>
          </div>
          
          <div className="bg-slate-900/80 border border-slate-700 p-1.5 rounded-full shadow-lg">
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10" } }} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-1">
          <PushNotification />
          <NotificationSettings />
          <DemandForm />
        </section>

        <section className="lg:col-span-2">
          <Suspense fallback={<div className="h-12 mb-6 bg-slate-800/50 rounded-xl animate-pulse"></div>}>
            <FilterBar />
          </Suspense>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <CheckSquare className="text-emerald-400" size={20} /> Coisas a Fazer
              </h3>
              <div className="space-y-3">
                {filteredTasks.length === 0 ? <p className="text-sm text-slate-500 font-medium text-center py-8">Nenhuma tarefa encontrada.</p> : filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Calendar className="text-purple-400" size={20} /> Reuniões
              </h3>
              <div className="space-y-3">
                {filteredMeetings.length === 0 ? <p className="text-sm text-slate-500 font-medium text-center py-8">Nenhuma reunião encontrada.</p> : filteredMeetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
              </div>
            </div>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[400px] bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 px-6 py-3.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex justify-around items-center z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-indigo-400 transition-transform">
          <CheckSquare size={22} />
          <span className="text-[9px] font-bold uppercase tracking-wider">Demandas</span>
        </Link>
        <Link href="/calendar" className="flex flex-col items-center gap-1 text-slate-500 hover:text-purple-400 transition-transform">
          <Calendar size={22} />
          <span className="text-[9px] font-bold uppercase tracking-wider">Calendário</span>
        </Link>
      </nav>
    </div>
  );
}