// app/components/DemandForm.tsx
'use client';

import { useState } from 'react';
import { Plus, CheckSquare, Calendar, Bell, MapPin } from 'lucide-react';
import { createTaskAction, createMeetingAction } from '../actions';

export default function DemandForm() {
  const [activeTab, setActiveTab] = useState<'tarefa' | 'reuniao'>('tarefa');

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl shadow-2xl shadow-black/40 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <h2 className="text-xl font-bold mb-5 text-slate-100 flex items-center gap-2">
        <Plus className="text-indigo-400" /> Nova Demanda
      </h2>

      {/* Abas Elegantes */}
      <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('tarefa')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
            activeTab === 'tarefa' 
              ? 'bg-indigo-500/20 text-indigo-300 shadow-sm border border-indigo-500/30' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <CheckSquare size={14} /> Tarefa
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reuniao')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
            activeTab === 'reuniao' 
              ? 'bg-purple-500/20 text-purple-300 shadow-sm border border-purple-500/30' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Calendar size={14} /> Reunião
        </button>
      </div>
      
      {/* Formulário Dinâmico */}
      <form action={activeTab === 'tarefa' ? createTaskAction : createMeetingAction} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Título (Comum aos dois) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Título da {activeTab === 'tarefa' ? 'Tarefa' : 'Reunião'}
          </label>
          <input 
            type="text" 
            name="title" 
            required 
            placeholder={activeTab === 'tarefa' ? "Ex: Atualizar versão na Play Store" : "Ex: Alinhamento DEHOUSE MARKET"}
            className="w-full bg-slate-950/80 border border-slate-700/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 shadow-inner"
          />
        </div>

        {/* Descrição (Comum aos dois) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Detalhes</label>
          <textarea 
            name="description" 
            placeholder={activeTab === 'tarefa' ? "Ex: Gravar vídeo vertical para redes sociais..." : "Pauta da reunião e links importantes..."}
            rows={2}
            className="w-full bg-slate-950/80 border border-slate-700/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none transition-all resize-none placeholder:text-slate-600 shadow-inner"
          />
        </div>

        {/* Campos Específicos: Tarefa */}
        {activeTab === 'tarefa' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contexto</label>
                <select name="category" className="w-full bg-slate-950/80 border border-slate-700/60 focus:border-indigo-500 rounded-xl px-3 py-3 text-sm text-slate-200 outline-none shadow-inner cursor-pointer">
                  <option value="trabalho">Trabalho</option>
                  <option value="pessoal">Pessoal</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Prioridade</label>
                <select name="priority" className="w-full bg-slate-950/80 border border-slate-700/60 focus:border-indigo-500 rounded-xl px-3 py-3 text-sm text-slate-200 outline-none shadow-inner cursor-pointer">
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Prazo Final</label>
              <input 
                type="datetime-local" 
                name="dueDate" 
                className="w-full bg-slate-950/80 border border-slate-700/60 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none shadow-inner cursor-pointer [color-scheme:dark]"
              />
            </div>
          </>
        )}

        {/* Campos Específicos: Reunião */}
        {activeTab === 'reuniao' && (
          <>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contexto</label>
              <select name="category" className="w-full bg-slate-950/80 border border-slate-700/60 focus:border-purple-500 rounded-xl px-3 py-3 text-sm text-slate-200 outline-none shadow-inner cursor-pointer">
                <option value="trabalho">Trabalho</option>
                <option value="pessoal">Pessoal</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Início</label>
                <input 
                  type="datetime-local" 
                  name="startTime" 
                  required
                  className="w-full bg-slate-950/80 border border-slate-700/60 focus:border-purple-500 rounded-xl px-3 py-3 text-sm text-slate-200 outline-none shadow-inner cursor-pointer [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Fim</label>
                <input 
                  type="datetime-local" 
                  name="endTime" 
                  required
                  className="w-full bg-slate-950/80 border border-slate-700/60 focus:border-purple-500 rounded-xl px-3 py-3 text-sm text-slate-200 outline-none shadow-inner cursor-pointer [color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Local / Link</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-slate-500" />
                </div>
                <input 
                  type="text" 
                  name="location" 
                  placeholder="Link do Meet ou Endereço..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700/60 focus:border-purple-500 rounded-xl text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                />
              </div>
            </div>
          </>
        )}

        {/* Alerta Inteligente (Comum aos dois) */}
        <div className={`border rounded-2xl p-4 mt-4 shadow-inner transition-colors ${activeTab === 'tarefa' ? 'bg-indigo-950/30 border-indigo-500/20' : 'bg-purple-950/30 border-purple-500/20'}`}>
          <label className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider mb-3 ${activeTab === 'tarefa' ? 'text-indigo-300' : 'text-purple-300'}`}>
            <Bell size={14} className="text-pink-400 animate-bounce" /> Alerta Inteligente
          </label>
          <select name="minutesBefore" className={`w-full bg-slate-950/80 border rounded-xl px-3 py-3 text-sm text-slate-200 outline-none cursor-pointer ${activeTab === 'tarefa' ? 'border-indigo-900/60 focus:border-pink-500' : 'border-purple-900/60 focus:border-pink-500'}`}>
            <option value="">Sem lembrete extra</option>
            <option value="5">5 minutos antes</option>
            <option value="15">15 minutos antes</option>
            <option value="60">1 hora antes</option>
          </select>
        </div>

        {/* Botão de Envio Dinâmico */}
        <button 
          type="submit"
          className={`w-full mt-4 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${
            activeTab === 'tarefa' 
              ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
              : 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-400 hover:via-fuchsia-400 hover:to-pink-400 shadow-[0_0_20px_rgba(217,70,239,0.4)]'
          }`}
        >
          {activeTab === 'tarefa' ? 'Adicionar à Lista' : 'Agendar Reunião'}
        </button>
      </form>
    </div>
  );
}