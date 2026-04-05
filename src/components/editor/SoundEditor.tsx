import React, { useRef, useState, useEffect } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useEditorStore } from '@/store/useEditorStore';
import { Sound } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { fileToDataUrl } from '@/utils/helpers';
import { Play, Pause, Trash2, Copy, Plus, Upload, Volume2 } from 'lucide-react';

const SoundEditor: React.FC = () => {
    const { currentProject, addSound, removeSound, updateSound } = useProjectStore();
    const { selectedSpriteId, isStageSelected } = useEditorStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedSoundIdx, setSelectedSoundIdx] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const target = isStageSelected
        ? currentProject?.stage
        : currentProject?.sprites.find(s => s.id === selectedSpriteId);

    if (!target) return <div className="flex items-center justify-center h-full text-gray-400">Выберите спрайт</div>;

    const sounds = target.sounds;
    const targetId = target.id;
    const selectedSound = sounds[selectedSoundIdx] || null;

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            const dataUrl = await fileToDataUrl(file);

            // Получаем длительность
            const audio = new Audio(dataUrl);
            await new Promise<void>((resolve) => {
                audio.onloadedmetadata = () => resolve();
                audio.onerror = () => resolve();
            });

            const sound: Sound = {
                id: uuidv4(),
                name: file.name.replace(/\.[^/.]+$/, ''),
                dataUrl,
                duration: audio.duration || 0,
                sampleRate: 44100,
            };

            addSound(targetId, sound);
        }

        e.target.value = '';
    };

    const handlePlay = () => {
        if (!selectedSound) return;

        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            return;
        }

        const audio = new Audio(selectedSound.dataUrl);
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        audio.play();
        setIsPlaying(true);
    };

    const handleDelete = (soundId: string) => {
        removeSound(targetId, soundId);
        setSelectedSoundIdx(Math.max(0, selectedSoundIdx - 1));
    };

    // Рисуем простую волну
    useEffect(() => {
        if (!canvasRef.current || !selectedSound) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;

        // Фон
        ctx.fillStyle = '#FFF0F5';
        ctx.fillRect(0, 0, w, h);

        // Рисуем псевдо-волну
        ctx.beginPath();
        ctx.strokeStyle = '#CF63CF';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(207, 99, 207, 0.3)';

        const centerY = h / 2;
        ctx.moveTo(0, centerY);

        for (let x = 0; x < w; x++) {
            const t = x / w;
            const amplitude = Math.sin(t * Math.PI) * (h * 0.35);
            const noise = Math.sin(t * 50) * amplitude * 0.3 +
                Math.sin(t * 120) * amplitude * 0.2 +
                Math.sin(t * 200) * amplitude * 0.1;
            const y = centerY - noise;
            ctx.lineTo(x, y);
        }

        // Заливка
        const pathTop = ctx.getImageData(0, 0, 1, 1); // save path
        ctx.lineTo(w, centerY);
        ctx.lineTo(0, centerY);
        ctx.closePath();
        ctx.fill();

        // Снова рисуем линию
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        for (let x = 0; x < w; x++) {
            const t = x / w;
            const amplitude = Math.sin(t * Math.PI) * (h * 0.35);
            const noise = Math.sin(t * 50) * amplitude * 0.3 +
                Math.sin(t * 120) * amplitude * 0.2 +
                Math.sin(t * 200) * amplitude * 0.1;
            ctx.lineTo(x, centerY - noise);
        }
        ctx.stroke();

        // Нижняя часть (зеркальная)
        ctx.beginPath();
        ctx.fillStyle = 'rgba(207, 99, 207, 0.2)';
        ctx.moveTo(0, centerY);
        for (let x = 0; x < w; x++) {
            const t = x / w;
            const amplitude = Math.sin(t * Math.PI) * (h * 0.35);
            const noise = Math.sin(t * 50) * amplitude * 0.3 +
                Math.sin(t * 120) * amplitude * 0.2 +
                Math.sin(t * 200) * amplitude * 0.1;
            ctx.lineTo(x, centerY + noise);
        }
        ctx.lineTo(w, centerY);
        ctx.lineTo(0, centerY);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, centerY);
        for (let x = 0; x < w; x++) {
            const t = x / w;
            const amplitude = Math.sin(t * Math.PI) * (h * 0.35);
            const noise = Math.sin(t * 50) * amplitude * 0.3 +
                Math.sin(t * 120) * amplitude * 0.2 +
                Math.sin(t * 200) * amplitude * 0.1;
            ctx.lineTo(x, centerY + noise);
        }
        ctx.stroke();

    }, [selectedSound]);

    return (
        <div className="flex h-full">
            {/* Список звуков */}
            <div className="w-24 bg-gray-50 border-r border-ui-border overflow-y-auto flex flex-col items-center py-2 gap-2">
                {sounds.map((sound, index) => (
                    <div
                        key={sound.id}
                        onClick={() => setSelectedSoundIdx(index)}
                        className={`relative group cursor-pointer rounded-lg p-1 transition-all w-20 ${
                            selectedSoundIdx === index
                                ? 'bg-purple-100 border-2 border-scratch-sound'
                                : 'bg-white border-2 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                        <div className="absolute -left-1 top-0 text-xs text-gray-400 font-bold">
                            {index + 1}
                        </div>

                        <div className="w-full aspect-square flex items-center justify-center bg-purple-50 rounded">
                            <Volume2 size={24} className="text-scratch-sound" />
                        </div>

                        <div className="text-center text-xs mt-1 truncate font-medium">
                            {sound.name}
                        </div>

                        <div className="text-center text-[10px] text-gray-400">
                            {sound.duration.toFixed(2)}с
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(sound.id);
                            }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            ×
                        </button>
                    </div>
                ))}

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-scratch-sound hover:bg-purple-50 transition-all"
                    title="Добавить звук"
                >
                    <Plus size={24} className="text-gray-400" />
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    multiple
                    onChange={handleUpload}
                    className="hidden"
                />
            </div>

            {/* Основная область */}
            <div className="flex-1 flex flex-col">
                {selectedSound ? (
                    <>
                        {/* Панель инструментов */}
                        <div className="flex items-center gap-4 px-4 py-2 border-b border-ui-border bg-white">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Звук:</span>
                                <input
                                    type="text"
                                    value={selectedSound.name}
                                    onChange={(e) => updateSound(targetId, selectedSound.id, { name: e.target.value })}
                                    className="border border-gray-300 rounded px-2 py-1 text-sm w-40"
                                />
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => {
                                        const dup: Sound = {
                                            ...selectedSound,
                                            id: uuidv4(),
                                            name: selectedSound.name + ' копия',
                                        };
                                        addSound(targetId, dup);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded flex items-center gap-1 text-sm"
                                    title="Копировать"
                                >
                                    <Copy size={16} /> Копировать
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedSound.id)}
                                    className="p-2 hover:bg-gray-100 rounded flex items-center gap-1 text-sm text-red-500"
                                    title="Удалить"
                                >
                                    <Trash2 size={16} /> Удалить
                                </button>
                            </div>
                        </div>

                        {/* Визуализация звука */}
                        <div className="flex-1 flex flex-col items-center justify-center bg-white p-4">
                            <canvas
                                ref={canvasRef}
                                width={800}
                                height={300}
                                className="w-full max-w-4xl rounded-lg border border-gray-200"
                            />

                            {/* Кнопка воспроизведения */}
                            <div className="mt-6 flex items-center gap-4">
                                <button
                                    onClick={handlePlay}
                                    className="w-14 h-14 bg-scratch-sound text-white rounded-full flex items-center justify-center hover:brightness-110 transition-all shadow-lg"
                                >
                                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                                </button>
                            </div>

                            {/* Эффекты (заглушки) */}
                            <div className="mt-6 flex items-center gap-4">
                                {['Быстрее', 'Медленнее', 'Громче', 'Тише', 'Заглушить', 'Усиление', 'Затухание', 'Развернуть', 'Робот'].map((effect) => (
                                    <button
                                        key={effect}
                                        className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded transition-colors"
                                        title={effect}
                                        onClick={() => alert(`Эффект "${effect}" будет доступен в следующей версии`)}
                                    >
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                            <Volume2 size={14} className="text-gray-500" />
                                        </div>
                                        <span className="text-[10px] text-gray-500">{effect}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <Volume2 size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>Нет звуков</p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-4 scratch-btn-primary"
                            >
                                Добавить звук
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SoundEditor;