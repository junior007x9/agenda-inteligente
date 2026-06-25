// app/components/DemandCards.tsx
'use client';

import { useState } from 'react';
import { Clock, Trash2, CheckCircle2, Circle, MapPin, Edit2, X, Save } from 'lucide-react';
import { deleteTaskAction, toggleTaskStatusAction, deleteMeetingAction, updateTaskAction, updateMeetingAction } from '../actions';

// Ajusta a data do DB para o formato do input datetime-local
const toInputDate = (dateString: Date | null) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export function TaskCard({ task }: { task: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const isDone = task.status === 'concluido';

  if (isEditing) {
    return (
      <div className="p-4 rounded-2xl border border-indigo-500/50 bg-slate-900 shadow-xl shadow-black/40 transition-all duration-300">
        <form action={async (formData) => { await updateTaskAction(task.id, formData); setIsEditing(false); }} className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Editando Tarefa</h4>
            <button type="button" onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-slate-300"><X size={18} /></button>
          </div>
          <input type="text" name="title" defaultValue={task.title} required className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none" />
          <textarea name="description" defaultValue={task.description || ''} rows={2} className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <select name="priority" defaultValue={task.priority} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none">
              <option value="media">Média</option><option value="alta">Alta</option><option value="baixa">Baixa</option>
            </select>
            <input type="datetime-local" name="dueDate" defaultValue={toInputDate(task.dueDate)} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none [color-scheme:dark]" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-sm flex items-center justify-center gap-2"><Save size={16} /> Salvar Alterações</button>
        </form>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl border bg-slate-900/60 backdrop-blur-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex justify-between items-start gap-3 group ${task.category === 'trabalho' ? 'border-l-4 border-l-indigo-500 border-slate-700/50' : 'border-l-4 border-l-emerald-500 border-slate-700/50'} ${isDone ? 'opacity-50 hover:opacity-100 bg-slate-950/80 grayscale' : 'hover:bg-slate-800/80'}`}>
      <button onClick={() => toggleTaskStatusAction(task.id, task.status)} className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors active:scale-90">
        {isDone ? <CheckCircle2 className="text-emerald-500" size={22} /> : <Circle size={22} />}
      </button>

      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className={`font-bold text-[15px] text-slate-100 transition-all ${isDone ? 'line-through text-slate-500' : ''}`}>{task.title}</h4>
          {!isDone && (
            <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md font-bold ${task.priority === 'alta' ? 'bg-red-500/20 text-red-400' : task.priority === 'media' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700/30 text-slate-400'}`}>
              {task.priority}
            </span>
          )}
        </div>
        {task.description && <p className={`text-[13px] line-clamp-2 leading-relaxed ${isDone ? 'text-slate-600 line-through' : 'text-slate-400'}`}>{task.description}</p>}
        {task.dueDate && !isDone && (
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 bg-slate-950/50 w-fit px-2 py-1 rounded-md border border-slate-800"><Clock size={12} className="text-indigo-400" /> {new Date(task.dueDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
        )}
      </div>
      
      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-indigo-400 p-1.5 rounded-xl hover:bg-indigo-500/10"><Edit2 size={16} /></button>
        <button onClick={() => deleteTaskAction(task.id)} className="text-slate-500 hover:text-red-400 p-1.5 rounded-xl hover:bg-red-500/10"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

export function MeetingCard({ meeting }: { meeting: any }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="p-4 rounded-2xl border border-purple-500/50 bg-slate-900 shadow-xl shadow-black/40 transition-all duration-300">
        <form action={async (formData) => { await updateMeetingAction(meeting.id, formData); setIsEditing(false); }} className="space-y-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Editando Reunião</h4>
            <button type="button" onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-slate-300"><X size={18} /></button>
          </div>
          <input type="text" name="title" defaultValue={meeting.title} required className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none" />
          <textarea name="description" defaultValue={meeting.description || ''} rows={2} className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <input type="datetime-local" name="startTime" required defaultValue={toInputDate(meeting.startTime)} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none [color-scheme:dark]" />
            <input type="datetime-local" name="endTime" required defaultValue={toInputDate(meeting.endTime)} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none [color-scheme:dark]" />
          </div>
          <input type="text" name="location" defaultValue={meeting.location || ''} placeholder="Local/Link" className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-slate-100 outline-none" />
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-xl text-sm flex items-center justify-center gap-2"><Save size={16} /> Salvar Alterações</button>
        </form>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl border bg-slate-900/60 backdrop-blur-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex justify-between items-start gap-4 group ${meeting.category === 'trabalho' ? 'border-l-4 border-l-indigo-500 border-slate-700/50' : 'border-l-4 border-l-emerald-500 border-slate-700/50'}`}>
      <div className="space-y-2 flex-1">
        <h4 className="font-bold text-[15px] text-slate-100">{meeting.title}</h4>
        {meeting.description && <p className="text-[13px] text-slate-400 leading-relaxed">{meeting.description}</p>}
        <div className="space-y-1.5 text-[11px] font-medium text-slate-400 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
          <span className="flex items-center gap-1.5"><Clock size={12} className="text-purple-400" /> {new Date(meeting.startTime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})} às {new Date(meeting.endTime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
          {meeting.location && <span className="flex items-center gap-1.5 text-indigo-300 mt-1"><MapPin size={12} /> {meeting.location}</span>}
        </div>
      </div>
      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-purple-400 p-1.5 rounded-xl hover:bg-purple-500/10"><Edit2 size={16} /></button>
        <button onClick={() => deleteMeetingAction(meeting.id)} className="text-slate-500 hover:text-red-400 p-1.5 rounded-xl hover:bg-red-500/10"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}