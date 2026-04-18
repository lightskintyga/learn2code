import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Project, SpriteTarget, StageTarget, Costume, Sound, ScratchVariable, ScratchList } from '@/types';
import { createDefaultProject, createDefaultSprite, createDefaultStage } from '@/utils/spriteDefaults';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants';

interface ProjectStore {
    // Текущий проект
    currentProject: Project | null;
    // Список проектов пользователя
    projects: Project[];
    // Активный пользователь
    activeUserId: string | null;
    // Флаг несохранённых изменений
    isDirty: boolean;

    // Проект
    setActiveUser: (userId: string | null) => void;
    hydrateProjectsForUser: (userId: string) => void;
    createProject: (name: string, authorId: string, authorName: string) => Project;
    loadProject: (projectId: string) => void;
    saveProject: () => void;
    deleteProject: (projectId: string) => void;
    clearCurrentProject: () => void;
    setProjectName: (name: string) => void;
    importProject: (json: string) => void;
    exportProject: () => string | null;
    getAllProjects: (userId: string) => Project[];

    // Спрайты
    addSprite: (sprite?: Partial<SpriteTarget>) => string;
    removeSprite: (spriteId: string) => void;
    duplicateSprite: (spriteId: string) => void;
    updateSprite: (spriteId: string, updates: Partial<SpriteTarget>) => void;
    getSprite: (spriteId: string) => SpriteTarget | undefined;

    // Сцена
    updateStage: (updates: Partial<StageTarget>) => void;

    // Костюмы
    addCostume: (targetId: string, costume: Costume) => void;
    removeCostume: (targetId: string, costumeId: string) => void;
    updateCostume: (targetId: string, costumeId: string, updates: Partial<Costume>) => void;
    reorderCostumes: (targetId: string, fromIndex: number, toIndex: number) => void;

    // Звуки
    addSound: (targetId: string, sound: Sound) => void;
    removeSound: (targetId: string, soundId: string) => void;
    updateSound: (targetId: string, soundId: string, updates: Partial<Sound>) => void;

    // Блоки (Blockly XML)
    updateBlocks: (targetId: string, blocksXml: string) => void;

    // Переменные
    addVariable: (targetId: string, variable: ScratchVariable) => void;
    removeVariable: (targetId: string, variableId: string) => void;
    updateVariable: (targetId: string, variableId: string, value: string | number) => void;

    // Списки
    addList: (targetId: string, list: ScratchList) => void;
    removeList: (targetId: string, listId: string) => void;
    updateList: (targetId: string, listId: string, value: (string | number)[]) => void;
}

const getUserProjectsKey = (userId: string) => `${LOCAL_STORAGE_KEYS.PROJECTS}_${userId}`;

const readUserProjects = (userId: string): Project[] => {
    const raw = localStorage.getItem(getUserProjectsKey(userId));
    return raw ? JSON.parse(raw) : [];
};

const writeUserProjects = (userId: string, projects: Project[]) => {
    localStorage.setItem(getUserProjectsKey(userId), JSON.stringify(projects));
};

export const useProjectStore = create<ProjectStore>()(
    persist(
        (set, get) => ({
            currentProject: null,
            projects: [],
            activeUserId: null,
            isDirty: false,

            setActiveUser: (userId) => {
                set({ activeUserId: userId });
            },

            hydrateProjectsForUser: (userId) => {
                const projects = readUserProjects(userId);
                set({ activeUserId: userId, projects, currentProject: null, isDirty: false });
            },

            createProject: (name, authorId, authorName) => {
                const project = createDefaultProject(name, authorId, authorName);
                set(state => {
                    const projects = [...state.projects.filter(p => p.id !== project.id), project];
                    writeUserProjects(authorId, projects.filter(p => p.authorId === authorId));
                    return {
                        currentProject: project,
                        projects,
                        activeUserId: authorId,
                        isDirty: false,
                    };
                });

                // TODO: API запрос для создания проекта на сервере
                // api.post('/projects', project);

                return project;
            },

            loadProject: (projectId) => {
                const { projects } = get();
                const project = projects.find(p => p.id === projectId);
                if (project) {
                    set({ currentProject: { ...project }, isDirty: false, activeUserId: project.authorId });
                }

                // TODO: Загрузка с сервера
                // const response = await api.get(`/projects/${projectId}`);
                // set({ currentProject: response.data, isDirty: false });
            },

            saveProject: () => {
                const { currentProject, projects } = get();
                if (!currentProject) return;

                const updated = {
                    ...currentProject,
                    updatedAt: new Date().toISOString(),
                };

                const idx = projects.findIndex(p => p.id === updated.id);
                const newProjects = [...projects];
                if (idx !== -1) {
                    newProjects[idx] = updated;
                } else {
                    newProjects.push(updated);
                }

                set({
                    currentProject: updated,
                    projects: newProjects,
                    isDirty: false,
                });
                writeUserProjects(updated.authorId, newProjects.filter(p => p.authorId === updated.authorId));

                // TODO: Сохранение на сервер
                // api.put(`/projects/${updated.id}`, updated);
            },

            deleteProject: (projectId) => {
                const { projects, currentProject } = get();
                const target = projects.find(p => p.id === projectId);
                set(state => ({
                    projects: state.projects.filter(p => p.id !== projectId),
                    currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
                }));

                if (target) {
                    writeUserProjects(target.authorId, projects.filter(p => p.id !== projectId && p.authorId === target.authorId));
                }

                // TODO: Удаление на сервере
                // api.delete(`/projects/${projectId}`);
            },

            clearCurrentProject: () => set({ currentProject: null, isDirty: false }),

            setProjectName: (name) => {
                set(state => {
                    if (!state.currentProject) return state;
                    return {
                        currentProject: { ...state.currentProject, name },
                        isDirty: true,
                    };
                });
            },

            importProject: (json) => {
                try {
                    const project = JSON.parse(json) as Project;
                    const authorId = get().activeUserId || project.authorId;
                    project.id = uuidv4(); // Новый ID при импорте
                    project.authorId = authorId;
                    project.createdAt = new Date().toISOString();
                    project.updatedAt = new Date().toISOString();
                    set(state => {
                        const projects = [...state.projects, project];
                        if (authorId) writeUserProjects(authorId, projects.filter(p => p.authorId === authorId));
                        return {
                            currentProject: project,
                            projects,
                            isDirty: false,
                        };
                    });
                } catch (e) {
                    console.error('Failed to import project:', e);
                }
            },

            exportProject: () => {
                const { currentProject } = get();
                if (!currentProject) return null;
                return JSON.stringify(currentProject, null, 2);
            },

            getAllProjects: (userId) => {
                const stateProjects = get().projects.filter(p => p.authorId === userId);
                const localProjects = readUserProjects(userId);
                const merged = [...localProjects, ...stateProjects].reduce<Project[]>((acc, project) => {
                    if (!acc.some(p => p.id === project.id)) acc.push(project);
                    return acc;
                }, []);
                return merged;
            },

            // Спрайты
            addSprite: (partial) => {
                const sprite = createDefaultSprite(partial);
                set(state => {
                    if (!state.currentProject) return state;
                    const currentProject = {
                        ...state.currentProject,
                        sprites: [...state.currentProject.sprites, sprite],
                    };
                    const projects = state.projects.map(p => p.id === currentProject.id ? currentProject : p);
                    if (currentProject.authorId) {
                        writeUserProjects(currentProject.authorId, projects.filter(p => p.authorId === currentProject.authorId));
                    }
                    return {
                        currentProject,
                        projects,
                        isDirty: true,
                    };
                });
                return sprite.id;
            },

            removeSprite: (spriteId) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const currentProject = {
                        ...state.currentProject,
                        sprites: state.currentProject.sprites.filter(s => s.id !== spriteId),
                    };
                    const projects = state.projects.map(p => p.id === currentProject.id ? currentProject : p);
                    if (currentProject.authorId) {
                        writeUserProjects(currentProject.authorId, projects.filter(p => p.authorId === currentProject.authorId));
                    }
                    return {
                        currentProject,
                        projects,
                        isDirty: true,
                    };
                });
            },

            duplicateSprite: (spriteId) => {
                const { currentProject } = get();
                if (!currentProject) return;

                const original = currentProject.sprites.find(s => s.id === spriteId);
                if (!original) return;

                const duplicate: SpriteTarget = {
                    ...JSON.parse(JSON.stringify(original)),
                    id: uuidv4(),
                    name: `${original.name}2`,
                    x: original.x + 20,
                    y: original.y + 20,
                };

                set(state => {
                    if (!state.currentProject) return state;
                    const current = {
                        ...state.currentProject,
                        sprites: [...state.currentProject.sprites, duplicate],
                    };
                    const projects = state.projects.map(p => p.id === current.id ? current : p);
                    if (current.authorId) {
                        writeUserProjects(current.authorId, projects.filter(p => p.authorId === current.authorId));
                    }
                    return {
                        currentProject: current,
                        projects,
                        isDirty: true,
                    };
                });
            },

            updateSprite: (spriteId, updates) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const currentProject = {
                        ...state.currentProject,
                        sprites: state.currentProject.sprites.map(s =>
                            s.id === spriteId ? { ...s, ...updates } : s
                        ),
                    };
                    const projects = state.projects.map(p => p.id === currentProject.id ? currentProject : p);
                    if (currentProject.authorId) {
                        writeUserProjects(currentProject.authorId, projects.filter(p => p.authorId === currentProject.authorId));
                    }
                    return {
                        currentProject,
                        projects,
                        isDirty: true,
                    };
                });
            },

            getSprite: (spriteId) => {
                return get().currentProject?.sprites.find(s => s.id === spriteId);
            },

            updateStage: (updates) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const currentProject = {
                        ...state.currentProject,
                        stage: { ...state.currentProject.stage, ...updates },
                    };
                    const projects = state.projects.map(p => p.id === currentProject.id ? currentProject : p);
                    if (currentProject.authorId) {
                        writeUserProjects(currentProject.authorId, projects.filter(p => p.authorId === currentProject.authorId));
                    }
                    return {
                        currentProject,
                        projects,
                        isDirty: true,
                    };
                });
            },

            // Костюмы
            addCostume: (targetId, costume) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const project = { ...state.currentProject };

                    if (project.stage.id === targetId) {
                        project.stage = {
                            ...project.stage,
                            costumes: [...project.stage.costumes, costume],
                        };
                    } else {
                        project.sprites = project.sprites.map(s =>
                            s.id === targetId
                                ? { ...s, costumes: [...s.costumes, costume] }
                                : s
                        );
                    }

                    return { currentProject: project, isDirty: true };
                });
            },

            removeCostume: (targetId, costumeId) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const project = { ...state.currentProject };

                    if (project.stage.id === targetId) {
                        project.stage = {
                            ...project.stage,
                            costumes: project.stage.costumes.filter(c => c.id !== costumeId),
                        };
                    } else {
                        project.sprites = project.sprites.map(s =>
                            s.id === targetId
                                ? { ...s, costumes: s.costumes.filter(c => c.id !== costumeId) }
                                : s
                        );
                    }

                    return { currentProject: project, isDirty: true };
                });
            },

            updateCostume: (targetId, costumeId, updates) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const project = { ...state.currentProject };

                    const updateCostumes = (costumes: Costume[]) =>
                        costumes.map(c => c.id === costumeId ? { ...c, ...updates } : c);

                    if (project.stage.id === targetId) {
                        project.stage = {
                            ...project.stage,
                            costumes: updateCostumes(project.stage.costumes),
                        };
                    } else {
                        project.sprites = project.sprites.map(s =>
                            s.id === targetId
                                ? { ...s, costumes: updateCostumes(s.costumes) }
                                : s
                        );
                    }

                    return { currentProject: project, isDirty: true };
                });
            },

            reorderCostumes: (targetId, fromIndex, toIndex) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const project = { ...state.currentProject };

                    const reorder = (costumes: Costume[]) => {
                        const result = [...costumes];
                        const [removed] = result.splice(fromIndex, 1);
                        result.splice(toIndex, 0, removed);
                        return result;
                    };

                    if (project.stage.id === targetId) {
                        project.stage = {
                            ...project.stage,
                            costumes: reorder(project.stage.costumes),
                        };
                    } else {
                        project.sprites = project.sprites.map(s =>
                            s.id === targetId
                                ? { ...s, costumes: reorder(s.costumes) }
                                : s
                        );
                    }

                    return { currentProject: project, isDirty: true };
                });
            },

            // Звуки
            addSound: (targetId, sound) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const project = { ...state.currentProject };

                    if (project.stage.id === targetId) {
                        project.stage = {
                            ...project.stage,
                            sounds: [...project.stage.sounds, sound],
                        };
                    } else {
                        project.sprites = project.sprites.map(s =>
                            s.id === targetId
                                ? { ...s, sounds: [...s.sounds, sound] }
                                : s
                        );
                    }

                    return { currentProject: project, isDirty: true };
                });
            },

            removeSound: (targetId, soundId) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const project = { ...state.currentProject };

                    if (project.stage.id === targetId) {
                        project.stage = {
                            ...project.stage,
                            sounds: project.stage.sounds.filter(s => s.id !== soundId),
                        };
                    } else {
                        project.sprites = project.sprites.map(s =>
                            s.id === targetId
                                ? { ...s, sounds: s.sounds.filter(snd => snd.id !== soundId) }
                                : s
                        );
                    }

                    return { currentProject: project, isDirty: true };
                });
            },

            updateSound: (targetId, soundId, updates) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const project = { ...state.currentProject };

                    const updateSounds = (sounds: Sound[]) =>
                        sounds.map(s => s.id === soundId ? { ...s, ...updates } : s);

                    if (project.stage.id === targetId) {
                        project.stage = {
                            ...project.stage,
                            sounds: updateSounds(project.stage.sounds),
                        };
                    } else {
                        project.sprites = project.sprites.map(s =>
                            s.id === targetId
                                ? { ...s, sounds: updateSounds(s.sounds) }
                                : s
                        );
                    }

                    return { currentProject: project, isDirty: true };
                });
            },

            // Блоки
            updateBlocks: (targetId, blocksXml) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const project = { ...state.currentProject };

                    if (project.stage.id === targetId) {
                        project.stage = { ...project.stage, blocks: blocksXml };
                    } else {
                        project.sprites = project.sprites.map(s =>
                            s.id === targetId ? { ...s, blocks: blocksXml } : s
                        );
                    }

                    const projects = state.projects.map(p => p.id === project.id ? project : p);
                    if (project.authorId) {
                        writeUserProjects(project.authorId, projects.filter(p => p.authorId === project.authorId));
                    }

                    return { currentProject: project, projects, isDirty: true };
                });
            },

            // Переменные
            addVariable: (targetId, variable) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const project = { ...state.currentProject };

                    const addVar = (vars: Record<string, ScratchVariable>) => ({
                        ...vars,
                        [variable.id]: variable,
                    });

                    if (project.stage.id === targetId) {
                        project.stage = {
                            ...project.stage,
                            variables: addVar(project.stage.variables),
                        };
                    } else {
                        project.sprites = project.sprites.map(s =>
                            s.id === targetId
                                ? { ...s, variables: addVar(s.variables) }
                                : s
                        );
                    }

                    return { currentProject: project, isDirty: true };
                });
            },

            removeVariable: (targetId, variableId) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const project = { ...state.currentProject };

                    const removeVar = (vars: Record<string, ScratchVariable>) => {
                        const { [variableId]: _, ...rest } = vars;
                        return rest;
                    };

                    if (project.stage.id === targetId) {
                        project.stage = {
                            ...project.stage,
                            variables: removeVar(project.stage.variables),
                        };
                    } else {
                        project.sprites = project.sprites.map(s =>
                            s.id === targetId
                                ? { ...s, variables: removeVar(s.variables) }
                                : s
                        );
                    }

                    return { currentProject: project, isDirty: true };
                });
            },

            updateVariable: (targetId, variableId, value) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const project = { ...state.currentProject };

                    const updateVar = (vars: Record<string, ScratchVariable>) => ({
                        ...vars,
                        [variableId]: { ...vars[variableId], value },
                    });

                    if (project.stage.id === targetId) {
                        project.stage = {
                            ...project.stage,
                            variables: updateVar(project.stage.variables),
                        };
                    } else {
                        project.sprites = project.sprites.map(s =>
                            s.id === targetId
                                ? { ...s, variables: updateVar(s.variables) }
                                : s
                        );
                    }

                    return { currentProject: project, isDirty: true };
                });
            },

            addList: (targetId, list) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const project = { ...state.currentProject };

                    const addL = (lists: Record<string, ScratchList>) => ({
                        ...lists,
                        [list.id]: list,
                    });

                    if (project.stage.id === targetId) {
                        project.stage = { ...project.stage, lists: addL(project.stage.lists) };
                    } else {
                        project.sprites = project.sprites.map(s =>
                            s.id === targetId ? { ...s, lists: addL(s.lists) } : s
                        );
                    }

                    return { currentProject: project, isDirty: true };
                });
            },

            removeList: (targetId, listId) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const project = { ...state.currentProject };

                    const removeL = (lists: Record<string, ScratchList>) => {
                        const { [listId]: _, ...rest } = lists;
                        return rest;
                    };

                    if (project.stage.id === targetId) {
                        project.stage = { ...project.stage, lists: removeL(project.stage.lists) };
                    } else {
                        project.sprites = project.sprites.map(s =>
                            s.id === targetId ? { ...s, lists: removeL(s.lists) } : s
                        );
                    }

                    return { currentProject: project, isDirty: true };
                });
            },

            updateList: (targetId, listId, value) => {
                set(state => {
                    if (!state.currentProject) return state;
                    const project = { ...state.currentProject };

                    const updateL = (lists: Record<string, ScratchList>) => ({
                        ...lists,
                        [listId]: { ...lists[listId], value },
                    });

                    if (project.stage.id === targetId) {
                        project.stage = { ...project.stage, lists: updateL(project.stage.lists) };
                    } else {
                        project.sprites = project.sprites.map(s =>
                            s.id === targetId ? { ...s, lists: updateL(s.lists) } : s
                        );
                    }

                    return { currentProject: project, isDirty: true };
                });
            },
        }),
        {
            name: 'scratch-projects',
            partialize: (state) => ({
                projects: state.projects,
            }),
        }
    )
);