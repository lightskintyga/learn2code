import { create } from 'zustand';
import {
    api,
    CreateUserRequest,
    ResetPasswordRequest,
    UpdateUserRequest,
    UserDto,
} from '@/services/api';

interface AdminStore {
    users: UserDto[];
    isLoading: boolean;
    error: string | null;

    clearError: () => void;
    fetchUsers: () => Promise<void>;
    createUser: (data: CreateUserRequest) => Promise<UserDto | null>;
    updateUser: (id: string, data: UpdateUserRequest) => Promise<UserDto | null>;
    deleteUser: (id: string) => Promise<boolean>;
    resetPassword: (id: string, data: ResetPasswordRequest) => Promise<boolean>;
    reset: () => void;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
    if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as { message?: unknown }).message;
        if (typeof message === 'string' && message.trim()) {
            return message;
        }
    }

    if (error instanceof Error && error.message.trim()) {
        return error.message;
    }

    return fallback;
};

const sortUsers = (users: UserDto[]) =>
    [...users].sort((a, b) =>
        (a.displayName || a.email || '').localeCompare(b.displayName || b.email || '', 'ru')
    );

export const useAdminStore = create<AdminStore>((set) => ({
    users: [],
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const users = await api.getUsers();
            set({ users: sortUsers(users), isLoading: false });
        } catch (error) {
            set({
                error: getErrorMessage(error, 'Ошибка загрузки пользователей'),
                isLoading: false,
            });
        }
    },

    createUser: async (data: CreateUserRequest) => {
        set({ isLoading: true, error: null });
        try {
            const user = await api.createUser(data);
            set((state) => ({
                users: sortUsers([...state.users, user]),
                isLoading: false,
            }));
            return user;
        } catch (error) {
            set({
                error: getErrorMessage(error, 'Ошибка создания пользователя'),
                isLoading: false,
            });
            return null;
        }
    },

    updateUser: async (id: string, data: UpdateUserRequest) => {
        set({ isLoading: true, error: null });
        try {
            const user = await api.updateUser(id, data);
            set((state) => ({
                users: sortUsers(state.users.map((item) => (item.id === id ? user : item))),
                isLoading: false,
            }));
            return user;
        } catch (error) {
            set({
                error: getErrorMessage(error, 'Ошибка обновления пользователя'),
                isLoading: false,
            });
            return null;
        }
    },

    deleteUser: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await api.deleteUser(id);
            set((state) => ({
                users: state.users.filter((user) => user.id !== id),
                isLoading: false,
            }));
            return true;
        } catch (error) {
            set({
                error: getErrorMessage(error, 'Ошибка удаления пользователя'),
                isLoading: false,
            });
            return false;
        }
    },

    resetPassword: async (id: string, data: ResetPasswordRequest) => {
        set({ isLoading: true, error: null });
        try {
            await api.resetPassword(id, data);
            set({ isLoading: false });
            return true;
        } catch (error) {
            set({
                error: getErrorMessage(error, 'Ошибка сброса пароля'),
                isLoading: false,
            });
            return false;
        }
    },

    reset: () => set({ users: [], isLoading: false, error: null }),
}));
