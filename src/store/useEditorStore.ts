import { create } from 'zustand';
import { EditorTab } from '@/types';

interface EditorStore {
    activeTab: EditorTab;
    selectedSpriteId: string | null;
    isStageSelected: boolean;
    isRunning: boolean;
    isTurboMode: boolean;
    zoom: number;
    showSpriteLibrary: boolean;
    showBackdropLibrary: boolean;
    showSoundLibrary: boolean;
    showCostumeLibrary: boolean;
    isFullscreen: boolean;
    toolboxCategoryOpen: string | null;

    setActiveTab: (tab: EditorTab) => void;
    selectSprite: (spriteId: string) => void;
    selectStage: () => void;
    setRunning: (running: boolean) => void;
    toggleTurboMode: () => void;
    setZoom: (zoom: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
    setShowSpriteLibrary: (show: boolean) => void;
    setShowBackdropLibrary: (show: boolean) => void;
    setShowSoundLibrary: (show: boolean) => void;
    setShowCostumeLibrary: (show: boolean) => void;
    setToolboxCategoryOpen: (category: string | null) => void;
    toggleFullscreen: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
    activeTab: 'code',
    selectedSpriteId: null,
    isStageSelected: false,
    isRunning: false,
    isTurboMode: false,
    zoom: 0.675,
    showSpriteLibrary: false,
    showBackdropLibrary: false,
    showSoundLibrary: false,
    showCostumeLibrary: false,
    isFullscreen: false,
    toolboxCategoryOpen: null,

    setActiveTab: (tab) => set({ activeTab: tab }),

    selectSprite: (spriteId) => set({
        selectedSpriteId: spriteId,
        isStageSelected: false,
    }),

    selectStage: () => set({
        selectedSpriteId: null,
        isStageSelected: true,
    }),

    setRunning: (running) => set({ isRunning: running }),

    toggleTurboMode: () => set(state => ({ isTurboMode: !state.isTurboMode })),

    setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(2, zoom)) }),

    zoomIn: () => set(state => ({ zoom: Math.min(2, state.zoom + 0.1) })),

    zoomOut: () => set(state => ({ zoom: Math.max(0.25, state.zoom - 0.1) })),

    resetZoom: () => set({ zoom: 0.675 }),

    setShowSpriteLibrary: (show) => set({ showSpriteLibrary: show }),

    setShowBackdropLibrary: (show) => set({ showBackdropLibrary: show }),

    setShowSoundLibrary: (show) => set({ showSoundLibrary: show }),

    setShowCostumeLibrary: (show) => set({ showCostumeLibrary: show }),

    setToolboxCategoryOpen: (category) => set({ toolboxCategoryOpen: category }),

    toggleFullscreen: () => set(state => ({ isFullscreen: !state.isFullscreen })),
}));
