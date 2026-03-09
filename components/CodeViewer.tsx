'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function CodeViewer({ code, language }: { code: string; language: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!code) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-500 flex-col gap-4">
                <div className="text-4xl text-pink-500/50">💻</div>
                <p className="text-lg">No code generated yet.</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/5 bg-black/60 font-mono text-sm leading-relaxed text-gray-300 shadow-inner group">
            <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg backdrop-blur shadow-lg border border-white/10 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2"
            >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                <span className="text-xs font-sans">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <div className="w-full h-full overflow-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
                <pre className="whitespace-pre-wrap">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}
