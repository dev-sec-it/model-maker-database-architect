'use client';

import { useCallback, useEffect } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Edge,
    Node,
    MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DatabaseSchema } from '@/lib/types';
import TableNode from './TableNode';

const nodeTypes = {
    tableNode: TableNode,
};

export default function RelationalView({ schema }: { schema: DatabaseSchema | null }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    useEffect(() => {
        if (!schema || !schema.tables) return;

        let x = 50;
        let y = 50;
        const newNodes: Node[] = schema.tables.map((table, i) => {
            const node: Node = {
                id: table.name,
                type: 'tableNode',
                position: { x, y },
                data: { table },
            };

            x += 350;
            if (x > 1000) {
                x = 50;
                y += 350;
            }
            return node;
        });

        const newEdges: Edge[] = (schema.relations || []).map((rel, i) => ({
            id: `e-${rel.fromTable}-${rel.toTable}-${i}`,
            source: rel.fromTable,
            target: rel.toTable,
            sourceHandle: `s-${rel.fromColumn}`,
            targetHandle: `t-${rel.toColumn}`,
            animated: true,
            style: { stroke: '#a855f7', strokeWidth: 2 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#a855f7',
            },
        }));

        setNodes(newNodes);
        setEdges(newEdges);
    }, [schema, setNodes, setEdges]);

    if (!schema) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-500 flex-col gap-4">
                <div className="text-4xl text-indigo-500/50">✨</div>
                <p className="text-lg">Enter details and hit generate to see the blueprint.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full rounded-xl overflow-hidden border border-white/5 bg-black/40 shadow-inner">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                className="react-flow-dark"
            >
                <Background gap={20} color="rgba(255,255,255,0.05)" />
                <Controls className="!bg-slate-900 !border-white/10 !fill-white" showInteractive={false} />
            </ReactFlow>
        </div>
    );
}
