import { Task, Submission, ClassGroup } from '@/types';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants';

// ======= Задания =======
export const getTasks = (classId?: string): Task[] => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEYS.TASKS);
    const tasks: Task[] = data ? JSON.parse(data) : [];
    if (classId) {
        return tasks.filter(t => t.classId === classId);
    }
    return tasks;
};

export const getTasksByTeacher = (teacherId: string): Task[] => {
    const tasks = getTasks();
    return tasks.filter(t => t.teacherId === teacherId);
};

export const getTask = (taskId: string): Task | undefined => {
    const tasks = getTasks();
    return tasks.find(t => t.id === taskId);
};

export const saveTask = (task: Task): void => {
    const tasks = getTasks();
    const idx = tasks.findIndex(t => t.id === task.id);
    if (idx !== -1) {
        tasks[idx] = task;
    } else {
        tasks.push(task);
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.TASKS, JSON.stringify(tasks));

    // TODO: API запрос
    // api.post('/tasks', task) или api.put(`/tasks/${task.id}`, task)
};

export const deleteTask = (taskId: string): void => {
    const tasks = getTasks().filter(t => t.id !== taskId);
    localStorage.setItem(LOCAL_STORAGE_KEYS.TASKS, JSON.stringify(tasks));

    // TODO: api.delete(`/tasks/${taskId}`)
};

// ======= Решения =======
export const getSubmissions = (taskId?: string): Submission[] => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEYS.SUBMISSIONS);
    const submissions: Submission[] = data ? JSON.parse(data) : [];
    if (taskId) {
        return submissions.filter(s => s.taskId === taskId);
    }
    return submissions;
};

export const getStudentSubmissions = (studentId: string): Submission[] => {
    const submissions = getSubmissions();
    return submissions.filter(s => s.studentId === studentId);
};

export const saveSubmission = (submission: Submission): void => {
    const submissions = getSubmissions();
    const idx = submissions.findIndex(s => s.id === submission.id);
    if (idx !== -1) {
        submissions[idx] = submission;
    } else {
        submissions.push(submission);
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));

    // TODO: api.post('/submissions', submission)
};

// ======= Классы =======
export const getClasses = (): ClassGroup[] => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEYS.CLASSES);
    return data ? JSON.parse(data) : [];
};

export const getClassesByTeacher = (teacherId: string): ClassGroup[] => {
    return getClasses().filter(c => c.teacherId === teacherId);
};

export const saveClass = (classGroup: ClassGroup): void => {
    const classes = getClasses();
    const idx = classes.findIndex(c => c.id === classGroup.id);
    if (idx !== -1) {
        classes[idx] = classGroup;
    } else {
        classes.push(classGroup);
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.CLASSES, JSON.stringify(classes));

    // TODO: api.post('/classes', classGroup)
};