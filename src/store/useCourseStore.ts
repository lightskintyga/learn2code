import { create } from 'zustand';
import { api, CourseDto, LessonDto, TaskDto, GroupDto, ProgressDto, CreateCourseRequest, UpdateCourseRequest, CreateLessonRequest, UpdateLessonRequest, CreateTaskRequest, UpdateTaskRequest, CreateGroupRequest } from '@/services/api';

interface CourseStore {
    // Состояние
    courses: CourseDto[];
    currentCourse: CourseDto | null;
    lessons: LessonDto[];
    currentLesson: LessonDto | null;
    tasks: TaskDto[];
    currentTask: TaskDto | null;
    groups: GroupDto[];
    currentGroup: GroupDto | null;
    progress: ProgressDto[];
    isLoading: boolean;
    error: string | null;

    // Действия
    clearError: () => void;

    // Курсы
    fetchCourses: () => Promise<void>;
    fetchCourse: (id: string) => Promise<void>;
    createCourse: (data: CreateCourseRequest) => Promise<CourseDto | null>;
    updateCourse: (id: string, data: UpdateCourseRequest) => Promise<CourseDto | null>;
    deleteCourse: (id: string) => Promise<boolean>;
    setCurrentCourse: (course: CourseDto | null) => void;

    // Уроки
    fetchLessons: (courseId: string) => Promise<void>;
    fetchLesson: (id: string) => Promise<void>;
    createLesson: (data: CreateLessonRequest) => Promise<LessonDto | null>;
    updateLesson: (id: string, data: UpdateLessonRequest) => Promise<LessonDto | null>;
    deleteLesson: (id: string) => Promise<boolean>;
    setCurrentLesson: (lesson: LessonDto | null) => void;

    // Задания
    fetchTasks: (lessonId: string) => Promise<void>;
    fetchTask: (id: string) => Promise<void>;
    createTask: (data: CreateTaskRequest) => Promise<TaskDto | null>;
    updateTask: (id: string, data: UpdateTaskRequest) => Promise<TaskDto | null>;
    deleteTask: (id: string) => Promise<boolean>;
    setCurrentTask: (task: TaskDto | null) => void;

    // Группы
    fetchGroups: () => Promise<void>;
    fetchGroup: (id: string) => Promise<void>;
    createGroup: (data: CreateGroupRequest) => Promise<GroupDto | null>;
    addStudentToGroup: (groupId: string, studentId: string) => Promise<boolean>;
    removeStudentFromGroup: (groupId: string, studentId: string) => Promise<boolean>;
    setCurrentGroup: (group: GroupDto | null) => void;

    // Прогресс
    fetchProgress: (studentId?: string) => Promise<void>;

    // Сброс состояния
    reset: () => void;
}

export const useCourseStore = create<CourseStore>((set, get) => ({
    // Начальное состояние
    courses: [],
    currentCourse: null,
    lessons: [],
    currentLesson: null,
    tasks: [],
    currentTask: null,
    groups: [],
    currentGroup: null,
    progress: [],
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    // ========== Курсы ==========
    fetchCourses: async () => {
        set({ isLoading: true, error: null });
        try {
            const courses = await api.getCourses();
            set({ courses, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки курсов';
            set({ error: errorMessage, isLoading: false });
        }
    },

    fetchCourse: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const course = await api.getCourse(id);
            set({ currentCourse: course, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки курса';
            set({ error: errorMessage, isLoading: false });
        }
    },

    createCourse: async (data: CreateCourseRequest) => {
        set({ isLoading: true, error: null });
        try {
            const course = await api.createCourse(data);
            set((state) => ({
                courses: [...state.courses, course],
                isLoading: false,
            }));
            return course;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка создания курса';
            set({ error: errorMessage, isLoading: false });
            return null;
        }
    },

    updateCourse: async (id: string, data: UpdateCourseRequest) => {
        set({ isLoading: true, error: null });
        try {
            const course = await api.updateCourse(id, data);
            set((state) => ({
                courses: state.courses.map((c) => (c.id === id ? course : c)),
                currentCourse: state.currentCourse?.id === id ? course : state.currentCourse,
                isLoading: false,
            }));
            return course;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления курса';
            set({ error: errorMessage, isLoading: false });
            return null;
        }
    },

    deleteCourse: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await api.deleteCourse(id);
            set((state) => ({
                courses: state.courses.filter((c) => c.id !== id),
                currentCourse: state.currentCourse?.id === id ? null : state.currentCourse,
                isLoading: false,
            }));
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка удаления курса';
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    setCurrentCourse: (course: CourseDto | null) => set({ currentCourse: course }),

    // ========== Уроки ==========
    fetchLessons: async (courseId: string) => {
        set({ isLoading: true, error: null });
        try {
            const lessons = await api.getLessons(courseId);
            set({ lessons, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки уроков';
            set({ error: errorMessage, isLoading: false });
        }
    },

    fetchLesson: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const lesson = await api.getLesson(id);
            set({ currentLesson: lesson, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки урока';
            set({ error: errorMessage, isLoading: false });
        }
    },

    createLesson: async (data: CreateLessonRequest) => {
        set({ isLoading: true, error: null });
        try {
            const lesson = await api.createLesson(data);
            set((state) => ({
                lessons: [...state.lessons, lesson],
                isLoading: false,
            }));
            return lesson;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка создания урока';
            set({ error: errorMessage, isLoading: false });
            return null;
        }
    },

    updateLesson: async (id: string, data: UpdateLessonRequest) => {
        set({ isLoading: true, error: null });
        try {
            const lesson = await api.updateLesson(id, data);
            set((state) => ({
                lessons: state.lessons.map((l) => (l.id === id ? lesson : l)),
                currentLesson: state.currentLesson?.id === id ? lesson : state.currentLesson,
                isLoading: false,
            }));
            return lesson;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления урока';
            set({ error: errorMessage, isLoading: false });
            return null;
        }
    },

    deleteLesson: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await api.deleteLesson(id);
            set((state) => ({
                lessons: state.lessons.filter((l) => l.id !== id),
                currentLesson: state.currentLesson?.id === id ? null : state.currentLesson,
                isLoading: false,
            }));
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка удаления урока';
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    setCurrentLesson: (lesson: LessonDto | null) => set({ currentLesson: lesson }),

    // ========== Задания ==========
    fetchTasks: async (lessonId: string) => {
        set({ isLoading: true, error: null });
        try {
            const tasks = await api.getTasks(lessonId);
            set({ tasks, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки заданий';
            set({ error: errorMessage, isLoading: false });
        }
    },

    fetchTask: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const task = await api.getTask(id);
            set({ currentTask: task, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки задания';
            set({ error: errorMessage, isLoading: false });
        }
    },

    createTask: async (data: CreateTaskRequest) => {
        set({ isLoading: true, error: null });
        try {
            const task = await api.createTask(data);
            set((state) => ({
                tasks: [...state.tasks, task],
                isLoading: false,
            }));
            return task;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка создания задания';
            set({ error: errorMessage, isLoading: false });
            return null;
        }
    },

    updateTask: async (id: string, data: UpdateTaskRequest) => {
        set({ isLoading: true, error: null });
        try {
            const task = await api.updateTask(id, data);
            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? task : t)),
                currentTask: state.currentTask?.id === id ? task : state.currentTask,
                isLoading: false,
            }));
            return task;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления задания';
            set({ error: errorMessage, isLoading: false });
            return null;
        }
    },

    deleteTask: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await api.deleteTask(id);
            set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
                currentTask: state.currentTask?.id === id ? null : state.currentTask,
                isLoading: false,
            }));
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка удаления задания';
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    setCurrentTask: (task: TaskDto | null) => set({ currentTask: task }),

    // ========== Группы ==========
    fetchGroups: async () => {
        set({ isLoading: true, error: null });
        try {
            const groups = await api.getGroups();
            set({ groups, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки групп';
            set({ error: errorMessage, isLoading: false });
        }
    },

    fetchGroup: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const group = await api.getGroup(id);
            set({ currentGroup: group, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки группы';
            set({ error: errorMessage, isLoading: false });
        }
    },

    createGroup: async (data: CreateGroupRequest) => {
        set({ isLoading: true, error: null });
        try {
            const group = await api.createGroup(data);
            set((state) => ({
                groups: [...state.groups, group],
                isLoading: false,
            }));
            return group;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка создания группы';
            set({ error: errorMessage, isLoading: false });
            return null;
        }
    },

    addStudentToGroup: async (groupId: string, studentId: string) => {
        set({ isLoading: true, error: null });
        try {
            await api.addStudentToGroup(groupId, studentId);
            // Обновляем текущую группу если она загружена
            const { currentGroup } = get();
            if (currentGroup?.id === groupId) {
                const updatedGroup = await api.getGroup(groupId);
                set({ currentGroup: updatedGroup, isLoading: false });
            } else {
                set({ isLoading: false });
            }
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка добавления студента';
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    removeStudentFromGroup: async (groupId: string, studentId: string) => {
        set({ isLoading: true, error: null });
        try {
            await api.removeStudentFromGroup(groupId, studentId);
            // Обновляем текущую группу если она загружена
            const { currentGroup } = get();
            if (currentGroup?.id === groupId) {
                const updatedGroup = await api.getGroup(groupId);
                set({ currentGroup: updatedGroup, isLoading: false });
            } else {
                set({ isLoading: false });
            }
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка удаления студента';
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    setCurrentGroup: (group: GroupDto | null) => set({ currentGroup: group }),

    // ========== Прогресс ==========
    fetchProgress: async (studentId?: string) => {
        set({ isLoading: true, error: null });
        try {
            const progress = await api.getProgress(studentId);
            set({ progress, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки прогресса';
            set({ error: errorMessage, isLoading: false });
        }
    },

    // ========== Сброс ==========
    reset: () => set({
        courses: [],
        currentCourse: null,
        lessons: [],
        currentLesson: null,
        tasks: [],
        currentTask: null,
        groups: [],
        currentGroup: null,
        progress: [],
        isLoading: false,
        error: null,
    }),
}));
