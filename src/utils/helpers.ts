export const degToRad = (deg: number): number => (deg * Math.PI) / 180;
export const radToDeg = (rad: number): number => (rad * 180) / Math.PI;

export const clamp = (value: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, value));

export const scratchDirToAngle = (direction: number): number => {
    // Scratch: 0=up, 90=right, 180/-180=down, -90=left
    // Canvas: 0=right, 90=down, 180=left, 270=up
    return direction - 90;
};

export const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.src = dataUrl;
    });
};

export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const generateColor = (): string => {
    const colors = ['#FF6680', '#4C97FF', '#9966FF', '#CF63CF', '#FFBF00', '#59C059', '#FF8C1A'];
    return colors[Math.floor(Math.random() * colors.length)];
};