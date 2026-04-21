export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    displayName: string;
    avatar?: string;
    createdAt: string;
    classId?: string; // для учеников — привязка к классу
}

export interface Costume {
    id: string;
    name: string;
    dataUrl: string; // base64 encoded image
    width: number;
    height: number;
    rotationCenterX: number;
    rotationCenterY: number;
}

export interface Sound {
    id: string;
    name: string;
    dataUrl: string; // base64 encoded audio
    duration: number;
    sampleRate?: number;
}

export interface SpriteTarget {
    id: string;
    name: string;
    isStage: false;
    x: number;
    y: number;
    size: number;
    direction: number;
    visible: boolean;
    draggable: boolean;
    rotationStyle: 'all around' | 'left-right' | 'don\'t rotate';
    currentCostume: number;
    costumes: Costume[];
    sounds: Sound[];
    volume: number;
    layerOrder: number;
    blocks: string; // Blockly XML workspace
    variables: Record<string, ScratchVariable>;
    lists: Record<string, ScratchList>;
}

export interface StageTarget {
    id: string;
    name: string;
    isStage: true;
    currentBackdrop: number;
    costumes: Costume[]; // backdrops
    sounds: Sound[];
    volume: number;
    blocks: string;
    variables: Record<string, ScratchVariable>;
    lists: Record<string, ScratchList>;
    tempo: number;
    videoTransparency: number;
    videoState: 'on' | 'off' | 'on-flipped';
}

export interface ScratchVariable {
    id: string;
    name: string;
    value: string | number;
    isCloud: boolean;
}

export interface ScratchList {
    id: string;
    name: string;
    value: (string | number)[];
}

export interface Project {
    id: string;
    name: string;
    authorId: string;
    authorName: string;
    description: string;
    stage: StageTarget;
    sprites: SpriteTarget[];
    extensions: string[];
    createdAt: string;
    updatedAt: string;
    thumbnail?: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    teacherId: string;
    classId: string;
    templateProject?: Project; // стартовый проект
    referenceProject?: Project; // эталонное решение
    dueDate?: string;
    createdAt: string;
    maxScore: number;
}

export interface Submission {
    id: string;
    taskId: string;
    studentId: string;
    studentName: string;
    project: Project;
    exportedCode: ExportedCode;
    submittedAt: string;
    score?: number;
    feedback?: string;
    status: 'submitted' | 'reviewed' | 'returned';
}

export interface ExportedCode {
    json: string;
    javascript?: string;
    python?: string;
    blocklyXml: string;
}

export interface ClassGroup {
    id: string;
    name: string;
    teacherId: string;
    studentIds: string[];
    createdAt: string;
}

export type EditorTab = 'code' | 'costumes' | 'sounds';

export interface EditorState {
    activeTab: EditorTab;
    selectedSpriteId: string | null;
    isStageSelected: boolean;
    isRunning: boolean;
    isTurboMode: boolean;
    zoom: number;
}