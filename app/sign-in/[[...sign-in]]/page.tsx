// app/sign-in/[[...sign-in]]/page.tsx
'use client';

import { SignInButton } from "@clerk/nextjs";
import { Sparkles, Lock } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-slate-950 p-6 text-center">
      <div className="flex flex-col items-center gap-4 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-slate-900 p-5 rounded-full border border-slate-800 shadow-2xl shadow-purple-500/20">
          <Sparkles className="text-purple-400 animate-pulse" size={48} />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Agenda Inteligente
        </h1>
        <p className="text-slate-400 font-medium max-w-xs mt-2 leading-relaxed">
          Seu ecossistema exclusivo e seguro para gerenciamento de demandas.
        </p>
      </div>
      
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        {/* Adicionamos o mode="modal" para forçar a caixinha a flutuar na tela */}
        <SignInButton mode="modal" fallbackRedirectUrl="/">
          <button className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 text-lg border border-indigo-400/20 cursor-pointer">
            <Lock size={20} /> Acessar Minha Agenda
          </button>
        </SignInButton>
        <p className="text-slate-600 text-xs mt-8 flex items-center justify-center gap-1 font-medium tracking-wide">
           Ambiente Seguro Autenticado
        </p>
      </div>
    </div>
  );
}