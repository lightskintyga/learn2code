// Базовый API сервис — заготовка для будущего бэкенда

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

class ApiService {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    setToken(token: string | null) {
        this.token = token;
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // TODO: Раскомментировать когда будет бэкенд
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        /*
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'GET',
          headers: this.getHeaders(),
        });
        return response.json();
        */
        throw new Error('API not implemented yet');
    }

    async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
        /*
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        });
        return response.json();
        */
        throw new Error('API not implemented yet');
    }

    async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
        /*
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        });
        return response.json();
        */
        throw new Error('API not implemented yet');
    }

    async patch<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
        /*
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        });
        return response.json();
        */
        throw new Error('API not implemented yet');
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        /*
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'DELETE',
          headers: this.getHeaders(),
        });
        return response.json();
        */
        throw new Error('API not implemented yet');
    }
}

export const api = new ApiService(API_BASE_URL);

// ======= Будущие эндпоинты =======
// POST   /auth/login          — авторизация
// POST   /auth/register       — регистрация
// GET    /auth/me             — текущий пользователь
// GET    /projects            — список проектов
// POST   /projects            — создать проект
// GET    /projects/:id        — получить проект
// PUT    /projects/:id        — обновить проект
// DELETE /projects/:id        — удалить проект
// GET    /tasks               — список заданий
// POST   /tasks               — создать задание (преподаватель)
// GET    /tasks/:id           — получить задание
// POST   /submissions         — отправить решение
// GET    /submissions?taskId= — получить решения по заданию
// PATCH  /submissions/:id     — оценить решение (преподаватель)
// GET    /classes             — список классов
// POST   /classes             — создать класс
// POST   /classes/:id/join    — присоединиться к классу