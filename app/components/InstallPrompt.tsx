// app/components/InstallPrompt.tsx
'use client';

import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // Começa como true para não piscar na tela
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 1. Verifica se o app já está instalado (rodando em modo standalone)
    const isApp = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(isApp);

    if (!isApp) {
      // Pequeno delay para a animação ficar suave ao carregar a página
      setTimeout(() => setShowPrompt(true), 1500);
    }

    // 2. Detecta se é um dispositivo Apple (iOS)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // 3. Intercepta o evento nativo de instalação do Android
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (isStandalone || !showPrompt) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Dispara o pop-up nativo do Android
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm bg-slate-900/95 backdrop-blur-xl shadow-2xl border border-indigo-500/30 rounded-3xl p-5 z-[100] animate-in slide-in-from-top-10 fade-in duration-500">
      <button 
        onClick={() => setShowPrompt(false)} 
        className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 transition-colors"
      >
        <X size={18} />
      </button>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20 flex-shrink-0">
          <Download className="text-white" size={24} />
        </div>
        <div>
          <h4 className="text-slate-100 font-extrabold text-sm">Instalar Aplicativo</h4>
          <p className="text-slate-400 text-[11px] leading-tight mt-0.5 font-medium">
            Tenha a Agenda Inteligente direto na sua tela inicial!
          </p>
        </div>
      </div>

      {isIOS ? (
        <div className="bg-slate-950/50 rounded-2xl p-3.5 text-[11px] text-slate-300 flex flex-col gap-2.5 border border-slate-800/50">
          <p className="flex items-center gap-2 font-medium">
            <span className="bg-slate-800 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">1</span> 
            Toque no ícone de Compartilhar <Share size={14} className="text-blue-400 ml-auto" />
          </p>
          <p className="flex items-center gap-2 font-medium">
            <span className="bg-slate-800 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">2</span> 
            Escolha "Adicionar à Tela" <PlusSquare size={14} className="text-slate-400 ml-auto" />
          </p>
        </div>
      ) : (
        <button 
          onClick={handleInstallClick}
          disabled={!deferredPrompt}
          className={`w-full py-3 rounded-2xl font-bold text-sm transition-all flex justify-center items-center gap-2 ${
            deferredPrompt 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white shadow-lg shadow-indigo-500/25 active:scale-95' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {deferredPrompt ? 'Instalar Agora' : 'Aguardando sistema...'}
        </button>
      )}
    </div>
  );
}