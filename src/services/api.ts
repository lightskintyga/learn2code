// API сервис для работы с Learn2Code Backend
// Swagger спецификация: Learn2Code API v1

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

// ============ DTO Типы из Swagger ============

export interface UserDto {
    id: string;
    email: string | null;
    displayName: string | null;
    role: string | null;
    createdAt: string;
}

export interface CourseDto {
    id: string;
    title: string | null;
    description: string | null;
    teacherId: string;
    createdAt: string;
}

export interface LessonDto {
    id: string;
    title: string | null;
    description: string | null;
    order: number;
    courseId: string;
}

export interface TaskDto {
    id: string;
    title: string | null;
    description: string | null;
    order: number;
    lessonId: string;
    referenceCode: string | null;
    initialStateJson: string | null;
    expectedStateJson: string | null;
    configJson: string | null;
}

export interface GroupDto {
    id: string;
    name: string | null;
    description: string | null;
    courseId: string;
    teacherId: string;
    createdAt: string;
    students: UserDto[] | null;
}

export interface ProgressDto {
    taskId: string;
    taskTitle: string | null;
    completed: boolean;
    attemptsCount: number;
    lastAttemptAt: string;
}

export interface BlockMapping {
    blockId: string | null;
    type: string | null;
}

export interface CodeIssueDto {
    type: string | null;
    message: string | null;
    severity: string | null;
    blockId: string | null;
    line: number | null;
}

export interface CheckResultDto {
    isPassed: boolean;
    isOptimal: boolean;
    hint: string | null;
    issues: CodeIssueDto[] | null;
    metrics: Record<string, number> | null;
}

export interface SubmissionDto {
    id: string;
    taskId: string;
    studentId: string | null;
    code: string | null;
    language: string | null;
    isPassed: boolean;
    isOptimal: boolean;
    submittedAt: string;
    result: CheckResultDto;
}

// ============ Request Типы из Swagger ============

export interface LoginRequest {
    email: string | null;
    password: string | null;
}

export interface LoginResponse {
    token: string | null;
    user: UserDto;
}

export interface MeResponse {
    user: UserDto;
}

export interface ChangePasswordRequest {
    currentPassword: string | null;
    newPassword: string | null;
}

export interface CreateCourseRequest {
    title: string | null;
    description: string | null;
}

export interface UpdateCourseRequest {
    title: string | null;
    description: string | null;
}

export interface CreateLessonRequest {
    title: string | null;
    description: string | null;
    order: number;
    courseId: string;
}

export interface UpdateLessonRequest {
    title: string | null;
    description: string | null;
    order: number | null;
}

export interface CreateTaskRequest {
    title: string | null;
    description: string | null;
    referenceCode: string | null;
    initialStateJson: string | null;
    expectedStateJson: string | null;
    configJson: string | null;
    order: number;
    lessonId: string;
}

export interface UpdateTaskRequest {
    title: string | null;
    description: string | null;
    referenceCode: string | null;
    initialStateJson: string | null;
    expectedStateJson: string | null;
    configJson: string | null;
    order: number | null;
}

export interface CreateGroupRequest {
    name: string | null;
    description: string | null;
    courseId: string;
    teacherId: string;
}

export interface UpdateGroupRequest {
    name: string | null;
    description: string | null;
    teacherId: string | null;
}

export interface AddStudentToGroupRequest {
    studentId: string;
}

export interface SubmitSolutionRequest {
    language: string | null;
    code: string | null;
    blocklyXml: string | null;
    blockMap: Record<string, BlockMapping> | null;
}

export interface CreateUserRequest {
    email: string | null;
    displayName: string | null;
    password: string | null;
    role: string | null;
}

export interface UpdateUserRequest {
    email: string | null;
    displayName: string | null;
    role: string | null;
}

export interface ResetPasswordRequest {
    newPassword: string | null;
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
            const contentType = response.headers.get('content-type') || '';
            const fallbackMessage = `HTTP ${response.status}: ${response.statusText}`;
            let message = fallbackMessage;

            if (contentType.includes('application/json')) {
                const errorData = await response.json().catch(() => ({}));
                if (typeof errorData === 'string') {
                    message = errorData;
                } else if (errorData && typeof errorData === 'object') {
                    const data = errorData as { message?: string; title?: string };
                    message = data.message || data.title || fallbackMessage;
                }
            } else {
                const errorText = await response.text().catch(() => '');
                message = errorText || fallbackMessage;
            }

            throw {
                message,
                status: response.status,
            } as ApiError;
        }

        // Для пустых успешных ответов (204 или 200 OK без body) возвращаем пустой объект
        if (response.status === 204) {
            return {
                data: {} as T,
                success: true,
                message: 'OK',
            };
        }

        const responseText = await response.text();
        const data = responseText.trim() ? (JSON.parse(responseText) as T) : ({} as T);

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

    // ============ Auth API ============

    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await this.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    }

    async changePassword(data: ChangePasswordRequest): Promise<void> {
        await this.post('/auth/change-password', data);
    }

    async getCurrentUser(): Promise<UserDto> {
        const response = await this.get<MeResponse>('/auth/me');
        return response.data.user;
    }

    // ============ Courses API ============

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

    async updateCourse(id: string, data: UpdateCourseRequest): Promise<void> {
        await this.put(`/courses/${id}`, data);
    }

    async deleteCourse(id: string): Promise<void> {
        await this.delete(`/courses/${id}`);
    }

    // ============ Groups API ============

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

    async updateGroup(id: string, data: UpdateGroupRequest): Promise<GroupDto> {
        const response = await this.put<GroupDto>(`/groups/${id}`, data);
        return response.data;
    }

    async deleteGroup(id: string): Promise<void> {
        await this.delete(`/groups/${id}`);
    }

    async addStudentToGroup(groupId: string, data: AddStudentToGroupRequest): Promise<void> {
        await this.post(`/groups/${groupId}/students`, data);
    }

    async removeStudentFromGroup(groupId: string, studentId: string): Promise<void> {
        await this.delete(`/groups/${groupId}/students/${studentId}`);
    }

    async getGroupStudents(groupId: string): Promise<UserDto[]> {
        const response = await this.get<UserDto[]>(`/groups/${groupId}/students`);
        return response.data;
    }

    // ============ Lessons API ============

    async getLessons(courseId?: string): Promise<LessonDto[]> {
        let endpoint = '/lessons';
        if (courseId) {
            endpoint += `?courseId=${courseId}`;
        }
        const response = await this.get<LessonDto[]>(endpoint);
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

    async updateLesson(id: string, data: UpdateLessonRequest): Promise<void> {
        await this.put(`/lessons/${id}`, data);
    }

    async deleteLesson(id: string): Promise<void> {
        await this.delete(`/lessons/${id}`);
    }

    // ============ Tasks API (пути с заглавной буквы) ============

    async getTasks(lessonId?: string): Promise<TaskDto[]> {
        let endpoint = '/Tasks';
        if (lessonId) {
            endpoint += `?lessonId=${lessonId}`;
        }
        const response = await this.get<TaskDto[]>(endpoint);
        return response.data;
    }

    async getTask(id: string): Promise<TaskDto> {
        const response = await this.get<TaskDto>(`/Tasks/${id}`);
        return response.data;
    }

    async createTask(data: CreateTaskRequest): Promise<TaskDto> {
        const response = await this.post<TaskDto>('/Tasks', data);
        return response.data;
    }

    async updateTask(id: string, data: UpdateTaskRequest): Promise<void> {
        await this.put(`/Tasks/${id}`, data);
    }

    async deleteTask(id: string): Promise<void> {
        await this.delete(`/Tasks/${id}`);
    }

    // ============ Progress API (пути с заглавной буквы) ============

    async getStudentProgress(studentId: string): Promise<ProgressDto[]> {
        const response = await this.get<ProgressDto[]>(`/Progress/${studentId}`);
        return response.data;
    }

    async getStudentTaskProgress(studentId: string, taskId: string): Promise<ProgressDto> {
        const response = await this.get<ProgressDto>(`/Progress/${studentId}/tasks/${taskId}`);
        return response.data;
    }

    // ============ Submissions API ============

    async createTaskSubmission(taskId: string, data: SubmitSolutionRequest): Promise<SubmissionDto> {
        const response = await this.post<SubmissionDto>(`/tasks/${taskId}/Submissions`, data);
        return response.data;
    }

    async getTaskSubmissions(taskId: string, studentId?: string): Promise<SubmissionDto[]> {
        let endpoint = `/tasks/${taskId}/Submissions`;
        if (studentId) {
            endpoint += `?studentId=${studentId}`;
        }
        const response = await this.get<SubmissionDto[]>(endpoint);
        return response.data;
    }

    async getSubmissionById(taskId: string, submissionId: string): Promise<SubmissionDto> {
        const response = await this.get<SubmissionDto>(`/tasks/${taskId}/Submissions/${submissionId}`);
        return response.data;
    }

    // ============ Users API (пути с заглавной буквы) ============

    async getUsers(): Promise<UserDto[]> {
        const response = await this.get<UserDto[]>('/Users');
        return response.data;
    }

    async getUser(id: string): Promise<UserDto> {
        const response = await this.get<UserDto>(`/Users/${id}`);
        return response.data;
    }

    async createUser(data: CreateUserRequest): Promise<UserDto> {
        const response = await this.post<UserDto>('/Users', data);
        return response.data;
    }

    async updateUser(id: string, data: UpdateUserRequest): Promise<UserDto> {
        const response = await this.put<UserDto>(`/Users/${id}`, data);
        return response.data;
    }

    async deleteUser(id: string): Promise<void> {
        await this.delete(`/Users/${id}`);
    }

    async resetPassword(id: string, data: ResetPasswordRequest): Promise<void> {
        await this.post(`/Users/${id}/reset-password`, data);
    }
}

export const api = new ApiService(API_BASE_URL);
