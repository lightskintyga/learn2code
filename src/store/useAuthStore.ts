import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';
import { LoginCredentials, RegisterData } from '@/types/auth';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants';
import { useProjectStore } from '@/store/useProjectStore';
import { api, UserDto } from '@/services/api';

// Конвертер UserDto в User
const convertUserDto = (userDto: UserDto): User => ({
    id: userDto.id,
    username: userDto.login || '',
    email: '', // login используется вместо email
    role: (userDto.role?.toLowerCase() || 'student') as UserRole,
    displayName: userDto.displayName || '',
    createdAt: userDto.createdAt,
});

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    token: string | null;

    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
    updateProfile: (updates: Partial<User>) => void;
    initAuth: () => void;
    loadCurrentUser: () => Promise<boolean>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            token: null,

            initAuth: () => {
                const { token } = get();
                if (token) {
                    api.setToken(token);
                }
            },

            login: async (credentials: LoginCredentials) => {
                set({ isLoading: true, error: null });

                try {
                    // Используем API для входа
                    const response = await api.login({
                        login: credentials.login,
                        password: credentials.password,
                    });

                    const token = response.token;
                    const user = convertUserDto(response.user);

                    // Устанавливаем токен для API
                    api.setToken(token);

                    // Загружаем проекты пользователя
                    useProjectStore.getState().hydrateProjectsForUser(user.id);

                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                        token,
                    });

                    return true;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Неверное имя пользователя или пароль';
                    set({ error: errorMessage, isLoading: false });
                    return false;
                }
            },

            logout: () => {
                useProjectStore.getState().clearCurrentProject();
                api.setToken(null);
                set({
                    user: null,
                    isAuthenticated: false,
                    error: null,
                    isLoading: false,
                    token: null,
                });
            },

            clearError: () => {
                set({ error: null });
            },

            updateProfile: (updates: Partial<User>) => {
                const { user } = get();
                if (!user) return;

                const updatedUser = { ...user, ...updates };
                set({ user: updatedUser });

                // TODO: Добавить API endpoint для обновления профиля
                // api.patch(`/users/${user.id}`, updates);
            },

            loadCurrentUser: async () => {
                const { token } = get();
                if (!token) return false;

                set({ isLoading: true, error: null });
                try {
                    api.setToken(token);
                    const userDto = await api.getCurrentUser();
                    const user = convertUserDto(userDto);
                    set({ user, isAuthenticated: true, isLoading: false });
                    return true;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки пользователя';
                    set({ error: errorMessage, isLoading: false });
                    return false;
                }
            },

            changePassword: async (currentPassword: string, newPassword: string) => {
                set({ isLoading: true, error: null });
                try {
                    await api.changePassword({
                        currentPassword,
                        newPassword,
                    });
                    set({ isLoading: false });
                    return true;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Ошибка смены пароля';
                    set({ error: errorMessage, isLoading: false });
                    return false;
                }
            },
        }),
        {
            name: LOCAL_STORAGE_KEYS.AUTH,
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                token: state.token,
            }),
            onRehydrateStorage: () => (state) => {
                // После гидратации устанавливаем токен в API
                if (state?.token) {
                    api.setToken(state.token);
                }
            },
        }
    )
);
