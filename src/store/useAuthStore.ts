import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '@/types';
import { LoginCredentials, RegisterData } from '@/types/auth';

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

// Хелпер для работы с пользователями в localStorage
const getStoredUsers = (): StoredUser[] => {
    const data = localStorage.getItem('scratch_users');
    return data ? JSON.parse(data) : [];
};

const saveStoredUsers = (users: StoredUser[]) => {
    localStorage.setItem('scratch_users', JSON.stringify(users));
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials: LoginCredentials) => {
                set({ isLoading: true, error: null });

                // TODO: Заменить на API запрос
                // const response = await api.post('/auth/login', credentials);
                // set({ user: response.data.user, isAuthenticated: true, isLoading: false });

                // Имитация задержки сети
                await new Promise(resolve => setTimeout(resolve, 500));

                const users = getStoredUsers();
                const found = users.find(
                    u => u.username === credentials.username && u.password === credentials.password
                );

                if (found) {
                    const { password, ...user } = found;
                    set({ user, isAuthenticated: true, isLoading: false });
                    return true;
                } else {
                    set({ error: 'Неверное имя пользователя или пароль', isLoading: false });
                    return false;
                }
            },

            register: async (data: RegisterData) => {
                set({ isLoading: true, error: null });

                // TODO: Заменить на API запрос
                // const response = await api.post('/auth/register', data);
                // set({ user: response.data.user, isAuthenticated: true, isLoading: false });

                await new Promise(resolve => setTimeout(resolve, 500));

                if (data.password !== data.confirmPassword) {
                    set({ error: 'Пароли не совпадают', isLoading: false });
                    return false;
                }

                if (data.password.length < 6) {
                    set({ error: 'Пароль должен быть не менее 6 символов', isLoading: false });
                    return false;
                }

                const users = getStoredUsers();
                const exists = users.find(u => u.username === data.username || u.email === data.email);

                if (exists) {
                    set({ error: 'Пользователь с таким именем или email уже существует', isLoading: false });
                    return false;
                }

                const newUser: StoredUser = {
                    id: uuidv4(),
                    username: data.username,
                    email: data.email,
                    role: data.role,
                    displayName: data.displayName,
                    password: data.password,
                    createdAt: new Date().toISOString(),
                    classId: data.classCode || undefined,
                };

                users.push(newUser);
                saveStoredUsers(users);

                const { password, ...user } = newUser;
                set({ user, isAuthenticated: true, isLoading: false });
                return true;
            },

            logout: () => {
                set({ user: null, isAuthenticated: false, error: null });
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
            name: 'scratch-auth',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);