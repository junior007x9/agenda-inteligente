// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";
import { Sparkles } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-slate-950 p-4">
      {/* Logomarca no topo para evitar a sensação de "tela preta" */}
      <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Sparkles className="text-purple-400 animate-pulse" size={32} />
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Agenda Inteligente
        </h1>
      </div>
      
      <SignIn />
    </div>
  );
}