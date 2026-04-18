import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import EditorPage from '@/pages/EditorPage';
import TeacherDashboard from '@/pages/TeacherDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import CoursePage from '@/pages/CoursePage';
import EditCoursePage from '@/pages/EditCoursePage';
import EditTaskPage from '@/pages/EditTaskPage';
import StartPage from "@/pages/StartPage";

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <LoginPage />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/" /> : <RegisterPage />
        } />
        <Route path="/" element={
          isAuthenticated 
            ? (user?.role === 'teacher' 
                ? <Navigate to="/teacher" /> 
                : <Navigate to="/student" />)
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
          isAuthenticated && user?.role === 'teacher'
              ? <TeacherDashboard />
              : <Navigate to="/" />
        } />
        <Route path="/teacher/course/:courseId/edit" element={
          isAuthenticated && user?.role === 'teacher'
              ? <EditCoursePage />
              : <Navigate to="/" />
        } />
        <Route path="/teacher/course/:courseId/lesson/:lessonId/task/:taskId/edit" element={
          isAuthenticated && user?.role === 'teacher'
              ? <EditTaskPage />
              : <Navigate to="/" />
        } />
      </Routes>
  );
};

export default App;
