import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import EditorPage from '@/pages/EditorPage';
import HomePage from '@/pages/HomePage';
import TeacherDashboard from '@/pages/TeacherDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import ProjectsPage from '@/pages/ProjectsPage';

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
          isAuthenticated ? <HomePage /> : <Navigate to="/login" />
        } />
        <Route path="/editor" element={
          isAuthenticated ? <EditorPage /> : <Navigate to="/login" />
        } />
        <Route path="/editor/:projectId" element={
          isAuthenticated ? <EditorPage /> : <Navigate to="/login" />
        } />
        <Route path="/projects" element={
          isAuthenticated ? <ProjectsPage /> : <Navigate to="/login" />
        } />
        <Route path="/teacher" element={
          isAuthenticated && user?.role === 'teacher'
              ? <TeacherDashboard />
              : <Navigate to="/" />
        } />
        <Route path="/student" element={
          isAuthenticated && user?.role === 'student'
              ? <StudentDashboard />
              : <Navigate to="/" />
        } />
      </Routes>
  );
};

export default App;