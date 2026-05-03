// API сервис для работы с Learn2Code Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export interface ApiError {
    message: string;
    status: number;
}

// DTO типы для API
export interface CourseDto {
    id: string;
    title: string;
    description: string;
    teacherId: string;
    createdAt: string;
}

export interface LessonDto {
    id: string;
    title: string;
    description: string;
    order: number;
    courseId: string;
}

export interface TaskDto {
    id: string;
    title: string;
    description: string;
    order: number;
    lessonId: string;
    initialCode: string;
    expectedOutput: string;
    checkLevel: 'State' | 'Trace' | 'Ast';
    blockCategories?: string[];
}

export interface GroupDto {
    id: string;
    name: string;
    description: string | null;
    courseId: string;
    teacherId: string;
    createdAt: string;
    students: UserDto[];
}

export interface UserDto {
    id: string;
    email: string;
    displayName: string;
    role: 'Admin' | 'Teacher' | 'Student';
    createdAt: string;
}

export interface SubmissionDto {
    id: string;
    taskId: string;
    studentId: string;
    code: string;
    status: 'Pending' | 'Running' | 'Completed' | 'Failed';
    result: CheckResult | null;
    createdAt: string;
}

export interface CheckResult {
    isCorrect: boolean;
    score: number;
    message: string;
    details: {
        stateMatch: boolean;
        traceMatch: boolean;
        astMatch: boolean;
        issues: Issue[];
    };
}

export interface Issue {
    type: 'SyntaxError' | 'RuntimeError' | 'LogicError' | 'StyleWarning';
    severity: 'Low' | 'Medium' | 'High';
    message: string;
    line: number;
    column: number;
}

export interface ProgressDto {
    courseId: string;
    completedLessons: number;
    totalLessons: number;
    completedTasks: number;
    totalTasks: number;
    percentage: number;
}

// Request типы
export interface CreateCourseRequest {
    title: string;
    description: string;
}

export interface UpdateCourseRequest {
    title: string;
    description: string;
}

export interface CreateLessonRequest {
    title: string;
    description: string;
    order: number;
    courseId: string;
}

export interface UpdateLessonRequest {
    title: string;
    description: string;
    order: number;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    order: number;
    lessonId: string;
    initialCode: string;
    expectedOutput: string;
    checkLevel: 'State' | 'Trace' | 'Ast';
    blockCategories?: string[];
}

export interface UpdateTaskRequest {
    title: string;
    description: string;
    order: number;
    initialCode: string;
    expectedOutput: string;
    checkLevel: 'State' | 'Trace' | 'Ast';
    blockCategories?: string[];
}

export interface CreateGroupRequest {
    name: string;
    description: string;
    courseId: string;
    teacherId: string;
}

export interface CreateSubmissionRequest {
    taskId: string;
    code: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: UserDto;
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

    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw {
                message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
                status: response.status,
            } as ApiError;
        }

        // Для 204 No Content возвращаем пустой объект
        if (response.status === 204) {
            return {
                data: {} as T,
                success: true,
                message: 'OK',
            };
        }

        const data = await response.json();
        return {
            data,
            success: true,
            message: 'OK',
        };
    }

    // HTTP методы
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
    }

    async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return this.handleResponse<T>(response);
    }

    async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return this.handleResponse<T>(response);
    }

    async patch<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return this.handleResponse<T>(response);
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
    }

    // ======= Auth API =======
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await this.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    }

    async getCurrentUser(): Promise<UserDto> {
        const response = await this.get<UserDto>('/auth/me');
        return response.data;
    }

    // ======= Courses API =======
    async getCourses(): Promise<CourseDto[]> {
        const response = await this.get<CourseDto[]>('/courses');
        return response.data;
    }

    async getCourse(id: string): Promise<CourseDto> {
        const response = await this.get<CourseDto>(`/courses/${id}`);
        return response.data;
    }

    async createCourse(data: CreateCourseRequest): Promise<CourseDto> {
        const response = await this.post<CourseDto>('/courses', data);
        return response.data;
    }

    async updateCourse(id: string, data: UpdateCourseRequest): Promise<CourseDto> {
        await this.put(`/courses/${id}`, data);
        // После PUT запроса получаем обновленный курс
        return this.getCourse(id);
    }

    async deleteCourse(id: string): Promise<void> {
        await this.delete(`/courses/${id}`);
    }

    // ======= Lessons API =======
    async getLessons(courseId: string): Promise<LessonDto[]> {
        const response = await this.get<LessonDto[]>(`/lessons?courseId=${courseId}`);
        return response.data;
    }

    async getLesson(id: string): Promise<LessonDto> {
        const response = await this.get<LessonDto>(`/lessons/${id}`);
        return response.data;
    }

    async createLesson(data: CreateLessonRequest): Promise<LessonDto> {
        const response = await this.post<LessonDto>('/lessons', data);
        return response.data;
    }

    async updateLesson(id: string, data: UpdateLessonRequest): Promise<LessonDto> {
        await this.put(`/lessons/${id}`, data);
        // После PUT запроса получаем обновленный урок
        return this.getLesson(id);
    }

    async deleteLesson(id: string): Promise<void> {
        await this.delete(`/lessons/${id}`);
    }

    // ======= Tasks API =======
    async getTasks(lessonId: string): Promise<TaskDto[]> {
        const response = await this.get<TaskDto[]>(`/tasks?lessonId=${lessonId}`);
        return response.data;
    }

    async getTask(id: string): Promise<TaskDto> {
        const response = await this.get<TaskDto>(`/tasks/${id}`);
        return response.data;
    }

    async createTask(data: CreateTaskRequest): Promise<TaskDto> {
        const response = await this.post<TaskDto>('/tasks', data);
        return response.data;
    }

    async updateTask(id: string, data: UpdateTaskRequest): Promise<TaskDto> {
        await this.put(`/tasks/${id}`, data);
        // После PUT запроса получаем обновленное задание
        return this.getTask(id);
    }

    async deleteTask(id: string): Promise<void> {
        await this.delete(`/tasks/${id}`);
    }

    // ======= Groups API =======
    async getGroups(): Promise<GroupDto[]> {
        const response = await this.get<GroupDto[]>('/groups');
        return response.data;
    }

    async getGroup(id: string): Promise<GroupDto> {
        const response = await this.get<GroupDto>(`/groups/${id}`);
        return response.data;
    }

    async createGroup(data: CreateGroupRequest): Promise<GroupDto> {
        const response = await this.post<GroupDto>('/groups', data);
        return response.data;
    }

    async addStudentToGroup(groupId: string, studentId: string): Promise<void> {
        await this.post(`/groups/${groupId}/students`, { studentId });
    }

    async removeStudentFromGroup(groupId: string, studentId: string): Promise<void> {
        await this.delete(`/groups/${groupId}/students/${studentId}`);
    }

    async getGroupStudents(groupId: string): Promise<UserDto[]> {
        const response = await this.get<UserDto[]>(`/groups/${groupId}/students`);
        return response.data;
    }

    // ======= Submissions API =======
    async createSubmission(data: CreateSubmissionRequest): Promise<SubmissionDto> {
        const response = await this.post<SubmissionDto>('/submissions', data);
        return response.data;
    }

    async getSubmissions(taskId?: string, studentId?: string): Promise<SubmissionDto[]> {
        let endpoint = '/submissions';
        const params: string[] = [];
        if (taskId) params.push(`taskId=${taskId}`);
        if (studentId) params.push(`studentId=${studentId}`);
        if (params.length > 0) {
            endpoint += `?${params.join('&')}`;
        }
        const response = await this.get<SubmissionDto[]>(endpoint);
        return response.data;
    }

    // ======= Progress API =======
    async getProgress(studentId?: string): Promise<ProgressDto[]> {
        let endpoint = '/progress';
        if (studentId) {
            endpoint += `?studentId=${studentId}`;
        }
        const response = await this.get<ProgressDto[]>(endpoint);
        return response.data;
    }

    // ======= Users API =======
    async getUsers(): Promise<UserDto[]> {
        const response = await this.get<UserDto[]>('/users');
        return response.data;
    }
}

export const api = new ApiService(API_BASE_URL);
