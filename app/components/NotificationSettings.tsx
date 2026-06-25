// app/components/NotificationSettings.tsx
'use client';

import { useState, useEffect } from 'react';
import { Settings, Vibrate, Volume2, Play } from 'lucide-react';

const VIBRATION_PATTERNS = {
  curto: [200],
  duplo: [200, 100, 200],
  longo: [500],
  batida: [100, 50, 100, 50, 100, 50, 400],
};

const SOUND_FREQUENCIES = {
  suave: { type: 'sine', freq: 600, duration: 0.5 },
  alerta: { type: 'triangle', freq: 880, duration: 0.4 },
  retro: { type: 'square', freq: 440, duration: 0.3 },
};

export default function NotificationSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [vibration, setVibration] = useState<keyof typeof VIBRATION_PATTERNS>('duplo');
  const [sound, setSound] = useState<keyof typeof SOUND_FREQUENCIES>('alerta');

  useEffect(() => {
    const savedVib = localStorage.getItem('pref_vibration') as keyof typeof VIBRATION_PATTERNS;
    const savedSound = localStorage.getItem('pref_sound') as keyof typeof SOUND_FREQUENCIES;
    if (savedVib && VIBRATION_PATTERNS[savedVib]) setVibration(savedVib);
    if (savedSound && SOUND_FREQUENCIES[savedSound]) setSound(savedSound);
  }, []);

  const handleSaveAndTest = async () => {
    localStorage.setItem('pref_vibration', vibration);
    localStorage.setItem('pref_sound', sound);

    // 1. Testa a Vibração (Desperta a API com um delay mínimo)
    if ('vibrate' in navigator) {
      navigator.vibrate(0); // Para qualquer vibração atual
      setTimeout(() => {
        navigator.vibrate(VIBRATION_PATTERNS[vibration]);
      }, 50);
    } else {
      alert("Seu navegador atual bloqueia a vibração.");
    }

    // 2. Testa o Som (Forçando o desbloqueio do Android)
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      
      // Essencial para navegadores mobile: acorda o contexto de áudio
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const soundProfile = SOUND_FREQUENCIES[sound];
      
      osc.type = soundProfile.type as OscillatorType;
      osc.frequency.setValueAtTime(soundProfile.freq, ctx.currentTime);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Volume aumentado de 0.1 para 0.8 para ficar bem audível no celular
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + soundProfile.duration);
      
      osc.start();
      osc.stop(ctx.currentTime + soundProfile.duration);
    } catch (e) {
      console.error("Áudio bloqueado", e);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 w-full mb-6 bg-slate-900/60 border border-slate-700/50 hover:bg-slate-800/80 text-slate-300 rounded-2xl p-4 transition-all"
      >
        <Settings size={18} /> Personalizar Alertas (Som e Vibração)
      </button>
    );
  }

  return (
    <div className="w-full mb-6 bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-3xl p-6 shadow-xl animate-in fade-in zoom-in-95">
      <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-4">
        <Settings size={20} className="text-pink-400" /> Preferências de Alerta
      </h3>

      <div className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <Vibrate size={14} /> Padrão de Vibração
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(VIBRATION_PATTERNS).map((key) => (
              <button
                key={key}
                onClick={() => setVibration(key as any)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  vibration === key 
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' 
                    : 'bg-slate-950/50 text-slate-500 border-slate-800 hover:border-slate-600'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <Volume2 size={14} /> Toque de Alerta
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(SOUND_FREQUENCIES).map((key) => (
              <button
                key={key}
                onClick={() => setSound(key as any)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  sound === key 
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' 
                    : 'bg-slate-950/50 text-slate-500 border-slate-800 hover:border-slate-600'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            onClick={handleSaveAndTest}
            className="flex-1 bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-400 hover:to-orange-300 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
          >
            <Play size={16} /> Salvar e Testar
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}