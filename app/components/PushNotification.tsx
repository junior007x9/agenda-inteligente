// app/components/PushNotification.tsx
'use client';

import { useEffect, useState } from 'react';
import { BellRing } from 'lucide-react';

export default function PushNotification() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Verifica se o navegador suporta Service Workers e Notificações Push
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        new Notification('Tudo certo! 🎉', {
          body: 'A partir de agora você receberá os alertas das suas tarefas e reuniões.',
        });
      }
    } catch (error) {
      console.error('Erro ao pedir permissão:', error);
    }
  };

  // Se não suportar ou já tiver permitido, esconde o banner
  if (!isSupported || permission === 'granted') return null;

  return (
    <button 
      onClick={requestPermission}
      className="w-full mb-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/30 text-indigo-200 rounded-2xl p-4 flex items-center justify-between transition-all group shadow-lg shadow-black/20"
    >
      <div className="flex items-center gap-3">
        <div className="bg-indigo-500/20 p-2 rounded-xl group-hover:scale-110 group-hover:bg-indigo-500/30 transition-all duration-300">
          <BellRing className="text-indigo-400" size={20} />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-slate-200">Ativar Notificações</p>
          <p className="text-[11px] text-slate-400">Seja avisado antes dos compromissos</p>
        </div>
      </div>
      <span className="text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-colors transform active:scale-95">
        Permitir
      </span>
    </button>
  );
}