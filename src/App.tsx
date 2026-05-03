import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import LoginPage from '@/pages/LoginPage';
import ApplicationPage from '@/pages/ApplicationPage';
import EditorPage from '@/pages/EditorPage';
import TeacherDashboard from '@/pages/TeacherDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import CoursePage from '@/pages/CoursePage';
import EditCoursePage from '@/pages/EditCoursePage';
import EditTaskPage from '@/pages/EditTaskPage';
import StartPage from "@/pages/StartPage";
import AdminDashboard from '@/pages/AdminDashboard';
import AdminGroups from '@/pages/AdminGroups';
import AdminGroupEditor from '@/pages/AdminGroupEditor';
import AdminStudents from '@/pages/AdminStudents';
import AdminStudentNew from '@/pages/AdminStudentNew';
import AdminTeachers from '@/pages/AdminTeachers';
import AdminCourses from '@/pages/AdminCourses';

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Helper to determine home route based on role
  const getHomeRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'teacher':
        return '/teacher';
      case 'student':
        return '/student';
      default:
        return '/';
    }
  };

  return (
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to={getHomeRoute()} /> : <LoginPage />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to={getHomeRoute()} /> : <ApplicationPage />
        } />
        <Route path="/" element={
          isAuthenticated
            ? <Navigate to={getHomeRoute()} />
            : <StartPage />
        } />
        <Route path="/student" element={
          isAuthenticated && user?.role === 'student'
              ? <StudentDashboard />
              : <Navigate to="/" />
        } />
        <Route path="/course/:courseId" element={
          isAuthenticated && user?.role === 'student'
              ? <CoursePage />
              : <Navigate to="/" />
        } />
        <Route path="/editor/:taskId?" element={
          isAuthenticated ? <EditorPage /> : <Navigate to="/login" />
        } />
        <Route path="/teacher" element={
          isAuthenticated && (user?.role === 'teacher' || user?.role === 'admin')
              ? <TeacherDashboard />
              : <Navigate to="/" />
        } />
        <Route path="/teacher/course/:courseId/edit" element={
          isAuthenticated && (user?.role === 'teacher' || user?.role === 'admin')
              ? <EditCoursePage />
              : <Navigate to="/" />
        } />
        <Route path="/teacher/course/:courseId/lesson/:lessonId/task/:taskId/edit" element={
          isAuthenticated && (user?.role === 'teacher' || user?.role === 'admin')
              ? <EditTaskPage />
              : <Navigate to="/" />
        } />
        <Route path="/admin" element={
          isAuthenticated && user?.role === 'admin'
              ? <AdminDashboard />
              : <Navigate to="/" />
        } />
        <Route path="/admin/groups" element={
          isAuthenticated && user?.role === 'admin'
              ? <AdminGroups />
              : <Navigate to="/" />
        } />
        <Route path="/admin/groups/new" element={
          isAuthenticated && user?.role === 'admin'
              ? <AdminGroupEditor />
              : <Navigate to="/" />
        } />
        <Route path="/admin/groups/:groupId" element={
          isAuthenticated && user?.role === 'admin'
              ? <AdminGroupEditor />
              : <Navigate to="/" />
        } />
        <Route path="/admin/students" element={
          isAuthenticated && user?.role === 'admin'
              ? <AdminStudents />
              : <Navigate to="/" />
        } />
        <Route path="/admin/students/new" element={
          isAuthenticated && user?.role === 'admin'
              ? <AdminStudentNew />
              : <Navigate to="/" />
        } />
        <Route path="/admin/teachers" element={
          isAuthenticated && user?.role === 'admin'
              ? <AdminTeachers />
              : <Navigate to="/" />
        } />
        <Route path="/admin/courses" element={
          isAuthenticated && user?.role === 'admin'
              ? <AdminCourses />
              : <Navigate to="/" />
        } />
      </Routes>
  );
};

export default App;
