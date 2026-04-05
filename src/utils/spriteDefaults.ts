import { v4 as uuidv4 } from 'uuid';
import { Project, SpriteTarget, StageTarget, Costume, Sound } from '@/types';
import { DEFAULT_DIRECTION, DEFAULT_SPRITE_SIZE, DEFAULT_VOLUME, DEFAULT_TEMPO } from './constants';

// SVG кота Scratch (упрощённый)
const CAT_SVG = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 101">
  <g fill="none" fill-rule="evenodd">
    <g transform="translate(-12 -8)">
      <path fill="#FFAB19" d="M37.3 23.7L26.6 8.3c-1.4-2-4.3-2.1-5.8-.1L10.2 23.4c-1.1 1.5-.5 3.6 1.2 4.2l11.5 4c.6.2 1.1.6 1.4 1.1l5.9 10.4c.8 1.4 2.8 1.5 3.8.2l7.3-9.7c.7-.9.7-2.2.1-3.2l-4.1-6.7z"/>
      <path fill="#FFAB19" d="M82.7 23.7l10.7-15.4c1.4-2 4.3-2.1 5.8-.1l10.6 15.2c1.1 1.5.5 3.6-1.2 4.2l-11.5 4c-.6.2-1.1.6-1.4 1.1l-5.9 10.4c-.8 1.4-2.8 1.5-3.8.2l-7.3-9.7c-.7-.9-.7-2.2-.1-3.2l4.1-6.7z"/>
      <path fill="#FFAB19" d="M60 101.5c-20.7 0-37.5-16.8-37.5-37.5S39.3 26.5 60 26.5s37.5 16.8 37.5 37.5-16.8 37.5-37.5 37.5z"/>
      <circle cx="46" cy="58" r="5" fill="#FFF"/>
      <circle cx="74" cy="58" r="5" fill="#FFF"/>
      <circle cx="47" cy="59" r="3" fill="#393939"/>
      <circle cx="75" cy="59" r="3" fill="#393939"/>
      <path fill="#FFF" d="M60 72c-4 0-7 2-7 5s3 5 7 5 7-2 7-5-3-5-7-5z"/>
    </g>
  </g>
</svg>
`)}`;

// Белый фон сцены
const WHITE_BACKDROP = `data:image/svg+xml;base64,${btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360">
  <rect width="480" height="360" fill="white"/>
</svg>
`)}`;

export const createDefaultCostume = (name: string = 'costume1'): Costume => ({
    id: uuidv4(),
    name,
    dataUrl: CAT_SVG,
    width: 96,
    height: 101,
    rotationCenterX: 48,
    rotationCenterY: 50,
});

export const createDefaultBackdrop = (name: string = 'backdrop1'): Costume => ({
    id: uuidv4(),
    name,
    dataUrl: WHITE_BACKDROP,
    width: 480,
    height: 360,
    rotationCenterX: 240,
    rotationCenterY: 180,
});

export const createDefaultSprite = (partial?: Partial<SpriteTarget>): SpriteTarget => {
    const id = uuidv4();
    return {
        id,
        name: partial?.name || 'Спрайт1',
        isStage: false,
        x: 0,
        y: 0,
        size: DEFAULT_SPRITE_SIZE,
        direction: DEFAULT_DIRECTION,
        visible: true,
        draggable: false,
        rotationStyle: 'all around',
        currentCostume: 0,
        costumes: [createDefaultCostume()],
        sounds: [],
        volume: DEFAULT_VOLUME,
        layerOrder: 1,
        blocks: '',
        variables: {},
        lists: {},
        ...partial,
    };
};

export const createDefaultStage = (): StageTarget => ({
    id: uuidv4(),
    name: 'Сцена',
    isStage: true,
    currentBackdrop: 0,
    costumes: [createDefaultBackdrop()],
    sounds: [],
    volume: DEFAULT_VOLUME,
    blocks: '',
    variables: {},
    lists: {},
    tempo: DEFAULT_TEMPO,
    videoTransparency: 50,
    videoState: 'off',
});

export const createDefaultProject = (
    name: string,
    authorId: string,
    authorName: string
): Project => ({
    id: uuidv4(),
    name,
    authorId,
    authorName,
    description: '',
    stage: createDefaultStage(),
    sprites: [createDefaultSprite({ name: 'Спрайт1' })],
    extensions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
});