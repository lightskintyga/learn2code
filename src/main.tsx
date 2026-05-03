import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { useAuthStore } from '@/store/useAuthStore';

// Компонент для инициализации
const AppWithInit: React.FC = () => {
    useEffect(() => {
        // Инициализируем auth состояние при старте
        useAuthStore.getState().initAuth();
    }, []);

    return <App />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AppWithInit />
        </BrowserRouter>
    </React.StrictMode>
);
