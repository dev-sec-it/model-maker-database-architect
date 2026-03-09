import { Handle, Position } from '@xyflow/react';
import { Table } from '@/lib/types';
import { Key } from 'lucide-react';

export default function TableNode({ data }: { data: { table: Table } }) {
    const { table } = data;
    return (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl min-w-[280px] overflow-hidden font-sans">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 font-bold text-white flex justify-between items-center shadow-inner">
                <span className="tracking-wide">{table.name}</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
                {table.columns.map((col, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm relative group hover:bg-white/5 p-1 rounded-md transition-colors">
                        <div className="flex items-center gap-2">
                            {col.isPrimary && <Key size={14} className="text-yellow-400" />}
                            <span className={`${col.isPrimary ? 'font-bold text-yellow-200' : 'font-medium text-gray-300'}`}>
                                {col.name}
                            </span>
                            {!col.isNullable && !col.isPrimary && <span className="text-[10px] text-red-400 font-bold">*</span>}
                        </div>
                        <span className="text-xs text-indigo-300 font-mono tracking-tight">{col.type}</span>
                        {/* Handles for relationships */}
                        <Handle type="target" position={Position.Left} id={`t-${col.name}`} className="!w-3 !h-3 !bg-indigo-400 !border-2 !border-slate-900 !-left-[18px]" />
                        <Handle type="source" position={Position.Right} id={`s-${col.name}`} className="!w-3 !h-3 !bg-purple-400 !border-2 !border-slate-900 !-right-[18px]" />
                    </div>
                ))}
            </div>
        </div >
    );
}
