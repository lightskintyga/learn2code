import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { EditorTab } from '@/types';
import { Code, Image, Volume2 } from 'lucide-react';

const tabs: { id: EditorTab; label: string; icon: React.ReactNode }[] = [
    { id: 'code', label: 'Код', icon: <Code size={16} /> },
    { id: 'costumes', label: 'Костюмы', icon: <Image size={16} /> },
    { id: 'sounds', label: 'Звуки', icon: <Volume2 size={16} /> },
];

const TabBar: React.FC = () => {
    const { activeTab, setActiveTab } = useEditorStore();

    return (
        <div className="flex bg-scratch-purple/10 border-b border-ui-border">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all ${
                        activeTab === tab.id
                            ? 'bg-white text-scratch-purple border-b-2 border-scratch-purple -mb-px'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                    }`}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default TabBar;