export const STAGE_WIDTH = 480;
export const STAGE_HEIGHT = 360;

export const STAGE_DISPLAY_WIDTH = 480;
export const STAGE_DISPLAY_HEIGHT = 360;

export const SMALL_STAGE_WIDTH = 480 * 0.5;
export const SMALL_STAGE_HEIGHT = 360 * 0.5;

export const DEFAULT_SPRITE_SIZE = 100;
export const DEFAULT_DIRECTION = 90;
export const DEFAULT_VOLUME = 100;
export const DEFAULT_TEMPO = 60;

export const MAX_CLONES = 300;

export const ROTATION_STYLES = {
    ALL_AROUND: 'all around' as const,
    LEFT_RIGHT: 'left-right' as const,
    DONT_ROTATE: "don't rotate" as const,
};

export const LOCAL_STORAGE_KEYS = {
    AUTH: 'scratch_auth',
    USERS: 'scratch_users',
    PROJECTS: 'scratch_projects',
    TASKS: 'scratch_tasks',
    SUBMISSIONS: 'scratch_submissions',
    CLASSES: 'scratch_classes',
};