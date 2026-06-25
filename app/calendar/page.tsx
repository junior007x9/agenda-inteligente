// app/calendar/page.tsx
import Link from 'next/link';
import { getDashboardData } from '../actions';
import { Calendar as CalendarIcon, CheckSquare, ChevronLeft, ChevronRight } from 'lucide-react';

export default async function CalendarPage() {
  const { tasks, meetings } = await getDashboardData();
  
  // Lógica do Calendário (Mês Atual)
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Gerar os slots do grid
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ empty: true, date: null });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ empty: false, date: i });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 font-sans p-4 md:p-8 pb-32">
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-3">
          <CalendarIcon className="text-purple-400" size={32} /> Meu Mês
        </h1>
        <div className="flex items-center gap-4 bg-slate-900/60 p-2 rounded-2xl border border-slate-700/50">
          <button className="p-2 text-slate-400 hover:text-white transition-colors"><ChevronLeft size={20}/></button>
          <span className="font-bold text-sm uppercase tracking-wider">{monthNames[month]} {year}</span>
          <button className="p-2 text-slate-400 hover:text-white transition-colors"><ChevronRight size={20}/></button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-4 md:p-8 shadow-2xl">
          {/* Cabeçalho da Semana */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map(day => (
              <div key={day} className="text-center text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grid de Dias */}
          <div className="grid grid-cols-7 gap-2 md:gap-4 auto-rows-fr">
            {days.map((slot, index) => {
              if (slot.empty) return <div key={`empty-${index}`} className="bg-slate-950/20 rounded-2xl border border-transparent"></div>;

              // Filtrar demandas deste dia específico
              const dayTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate).getDate() === slot.date && new Date(t.dueDate).getMonth() === month);
              const dayMeetings = meetings.filter(m => new Date(m.startTime).getDate() === slot.date && new Date(m.startTime).getMonth() === month);
              const isToday = slot.date === today.getDate();

              return (
                <div key={slot.date} className={`min-h-[100px] md:min-h-[120px] p-2 md:p-3 rounded-2xl border transition-all ${isToday ? 'bg-indigo-900/20 border-indigo-500/50 shadow-inner' : 'bg-slate-900/60 border-slate-800/50 hover:border-slate-600'}`}>
                  <div className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full mb-2 ${isToday ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}>
                    {slot.date}
                  </div>
                  
                  <div className="space-y-1.5">
                    {dayMeetings.map(m => (
                      <div key={m.id} className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-1 rounded truncate">
                        {new Date(m.startTime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})} - {m.title}
                      </div>
                    ))}
                    {dayTasks.map(t => (
                      <div key={t.id} className={`text-[10px] px-1.5 py-1 rounded truncate border ${t.status === 'concluido' ? 'bg-slate-800 text-slate-500 border-slate-700 line-through' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'}`}>
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Menu Inferior */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[400px] bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 px-6 py-3.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex justify-around items-center z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-slate-500 hover:text-indigo-400 transition-transform">
          <CheckSquare size={22} />
          <span className="text-[9px] font-bold uppercase tracking-wider">Demandas</span>
        </Link>
        <Link href="/calendar" className="flex flex-col items-center gap-1 text-purple-400 transition-transform">
          <CalendarIcon size={22} />
          <span className="text-[9px] font-bold uppercase tracking-wider">Calendário</span>
        </Link>
      </nav>
    </div>
  );
}