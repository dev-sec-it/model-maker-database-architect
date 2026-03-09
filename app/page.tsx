'use client';

import { useState } from 'react';
import { Database, Code2, Smartphone, Terminal, Loader2, Sparkles, KeyRound } from 'lucide-react';
import RelationalView from '@/components/RelationalView';
import CodeViewer from '@/components/CodeViewer';
import { DatabaseSchema } from '@/lib/types';
import { generateSQL, generateFlutter, generateNextJsPrisma } from '@/lib/generators';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [schema, setSchema] = useState<DatabaseSchema | null>(null);
  const [sqlCode, setSqlCode] = useState('');
  const [flutterCode, setFlutterCode] = useState('');
  const [nextJsCode, setNextJsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'diagram' | 'sql' | 'flutter' | 'nextjs'>('diagram');

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, apiKey })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to generate schema');

      setSchema(data);
      setSqlCode(generateSQL(data));
      setFlutterCode(generateFlutter(data));
      setNextJsCode(generateNextJsPrisma(data));
      setActiveTab('diagram');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-indigo-500/30">

      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
      </div>

      <main className="flex flex-col md:flex-row w-full h-screen relative z-10">
        {/* Left Sidebar */}
        <section aria-label="Configuration Sidebar" className="w-full md:w-[400px] border-b md:border-b-0 md:border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col p-4 md:p-6 h-[50vh] md:h-full shrink-0 shadow-2xl z-20 overflow-y-auto">
          <header className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl">
              <Database className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200 tracking-tight">
              Model Maker
            </h1>
          </header>

          <div className="flex-1 flex flex-col gap-4 md:gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="apiKeyInput" className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <KeyRound size={16} /> Gemini API Key (Optional)
              </label>
              <input
                id="apiKeyInput"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 md:py-3 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all text-sm font-mono placeholder:text-slate-600"
              />
              <p className="text-xs text-slate-500">Leave blank if GEMINI_API_KEY is set in .env</p>
            </div>

            <div className="flex flex-col gap-2 flex-1 min-h-[120px]">
              <label htmlFor="promptInput" className="text-sm font-medium text-slate-400">Software Details</label>
              <textarea
                id="promptInput"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your app... e.g. A task management app with users, projects, tasks, and tags."
                className="w-full flex-1 bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-none text-sm leading-relaxed placeholder:text-slate-600 shadow-inner min-h-[100px]"
              />
            </div>

            {error && (
              <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 md:p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              aria-label="Generate Architecture"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 md:py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} className="group-hover:scale-110 transition-transform" />
                  Generate Architecture
                </>
              )}
            </button>
          </div>

          {/* Copyright Text */}
          <footer className="mt-6 md:mt-8 text-center border-t border-white/5 pt-3 md:pt-4">
            <p className="text-xs text-slate-500 font-medium">
              DEV SEC IT & OpenShifts
            </p>
            <p className="text-[10px] text-slate-600 mt-1">
              An open-sourced project
            </p>
          </footer>
        </section>

        {/* Main Content Area */}
        <section aria-label="Output Viewer" className="flex-1 flex flex-col h-[50vh] md:h-full bg-[#0a0a0a]/50 backdrop-blur-sm p-4 md:p-6 gap-4">
          {/* Tabs */}
          <nav aria-label="Content Tabs" className="flex items-center gap-2 md:gap-3 p-1.5 bg-black/40 rounded-xl border border-white/5 w-full md:w-fit backdrop-blur-md overflow-x-auto scrollbar-thin">
            {[
              { id: 'diagram', icon: Database, label: 'Relational View', shortForm: 'Diagram' },
              { id: 'sql', icon: Code2, label: 'SQL Export', shortForm: 'SQL' },
              { id: 'flutter', icon: Smartphone, label: 'Flutter Models', shortForm: 'Flutter' },
              { id: 'nextjs', icon: Terminal, label: 'Next.js (Prisma)', shortForm: 'NextJS' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 min-w-fit ${activeTab === tab.id
                  ? 'bg-white/10 text-white shadow-lg border border-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <tab.icon size={16} className={activeTab === tab.id ? 'text-indigo-400' : ''} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortForm}</span>
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'diagram' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
              <RelationalView schema={schema} />
            </div>
            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'sql' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
              <CodeViewer code={sqlCode} language="sql" />
            </div>
            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'flutter' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
              <CodeViewer code={flutterCode} language="dart" />
            </div>
            <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'nextjs' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
              <CodeViewer code={nextJsCode} language="typescript" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
