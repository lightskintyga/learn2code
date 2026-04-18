import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '@/types';
import { LoginCredentials, RegisterData } from '@/types/auth';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants';
import { useProjectStore } from '@/store/useProjectStore';

interface StoredUser extends User {
    password: string; // В реальном приложении хэш, сейчас для localStorage
}

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (credentials: LoginCredentials) => Promise<boolean>;
    register: (data: RegisterData) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
    updateProfile: (updates: Partial<User>) => void;
}

const DEMO_USERS: StoredUser[] = [
    {
        id: 'teacher-1',
        username: 'teacher',
        email: 'teacher@edu.com',
        role: 'teacher',
        displayName: 'Иван Петрович',
        password: '123456',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'student-1',
        username: 'student',
        email: 'student@edu.com',
        role: 'student',
        displayName: 'Алиса',
        password: '123456',
        createdAt: new Date().toISOString(),
        classId: 'class-1',
    },
];

const normalizeIdentifier = (value: string) => value.trim().toLowerCase();

// Хелпер для работы с пользователями в localStorage
const getStoredUsers = (): StoredUser[] => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
};

const saveStoredUsers = (users: StoredUser[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
};

const ensureDemoUsers = () => {
    const users = getStoredUsers();
    if (users.length === 0) {
        saveStoredUsers(DEMO_USERS);
    }
};

const getProjectStorageKey = (userId: string) => `${LOCAL_STORAGE_KEYS.PROJECTS}_${userId}`;
const getProjectsForUser = (userId: string) => {
    const data = localStorage.getItem(getProjectStorageKey(userId));
    return data ? JSON.parse(data) : [];
};
const setProjectsForUser = (userId: string, projects: unknown[]) => {
    localStorage.setItem(getProjectStorageKey(userId), JSON.stringify(projects));
};

if (typeof window !== 'undefined') {
    ensureDemoUsers();
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials: LoginCredentials) => {
                set({ isLoading: true, error: null });
                ensureDemoUsers();

                // TODO: Заменить на API запрос
                // const response = await api.post('/auth/login', credentials);
                // set({ user: response.data.user, isAuthenticated: true, isLoading: false });

                // Имитация задержки сети
                await new Promise(resolve => setTimeout(resolve, 300));

                const users = getStoredUsers();
                const loginId = normalizeIdentifier(credentials.username);
                const password = credentials.password;
                const found = users.find(
                    u =>
                        (normalizeIdentifier(u.username) === loginId || normalizeIdentifier(u.email) === loginId) &&
                        u.password === password
                );

                if (found) {
                    const { password: _password, ...user } = found;
                    useProjectStore.getState().hydrateProjectsForUser(user.id);
                    set({ user, isAuthenticated: true, isLoading: false, error: null });
                    return true;
                }

                set({ error: 'Неверное имя пользователя или пароль', isLoading: false });
                return false;
            },

            register: async (data: RegisterData) => {
                set({ isLoading: true, error: null });
                ensureDemoUsers();

                // TODO: Заменить на API запрос
                // const response = await api.post('/auth/register', data);
                // set({ user: response.data.user, isAuthenticated: true, isLoading: false });

                await new Promise(resolve => setTimeout(resolve, 300));

                const username = data.username.trim();
                const email = data.email.trim().toLowerCase();
                const displayName = data.displayName.trim();
                const password = data.password;
                const confirmPassword = data.confirmPassword;

                if (password !== confirmPassword) {
                    set({ error: 'Пароли не совпадают', isLoading: false });
                    return false;
                }

                if (password.length < 6) {
                    set({ error: 'Пароль должен быть не менее 6 символов', isLoading: false });
                    return false;
                }

                const users = getStoredUsers();
                const exists = users.find(
                    u => normalizeIdentifier(u.username) === normalizeIdentifier(username) || normalizeIdentifier(u.email) === email
                );

                if (exists) {
                    set({ error: 'Пользователь с таким именем или email уже существует', isLoading: false });
                    return false;
                }

                const newUser: StoredUser = {
                    id: uuidv4(),
                    username,
                    email,
                    role: data.role,
                    displayName,
                    password,
                    createdAt: new Date().toISOString(),
                    classId: data.classCode?.trim() || undefined,
                };

                users.push(newUser);
                saveStoredUsers(users);

                const { password: _password, ...user } = newUser;
                useProjectStore.getState().hydrateProjectsForUser(user.id);
                set({ user, isAuthenticated: true, isLoading: false, error: null });
                return true;
            },

            logout: () => {
                useProjectStore.getState().clearCurrentProject();
                set({ user: null, isAuthenticated: false, error: null, isLoading: false });
            },

            clearError: () => {
                set({ error: null });
            },

            updateProfile: (updates: Partial<User>) => {
                const { user } = get();
                if (!user) return;

                const updatedUser = { ...user, ...updates };
                set({ user: updatedUser });

                // Обновляем в localStorage
                const users = getStoredUsers();
                const idx = users.findIndex(u => u.id === user.id);
                if (idx !== -1) {
                    users[idx] = { ...users[idx], ...updates };
                    saveStoredUsers(users);
                }

                // TODO: Заменить на API запрос
                // api.patch(`/users/${user.id}`, updates);
            },
        }),
        {
            name: LOCAL_STORAGE_KEYS.AUTH,
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
