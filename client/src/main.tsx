import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App.tsx';
import { CurrUserProvider } from './Components/Context/UserContext.tsx';
import { ClickedClassProvider } from './Components/Context/ClassContext.tsx';
import { QuizProvider } from './Components/Context/QuizContext.tsx';
import './Components/index.css'

if (import.meta.env.VITE_LOGGING !== 'true') { 
    // Override console methods to disable logging
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};

    // Suppress unhandled runtime errors in the browser
    window.onerror = () => true;

    // Suppress Promise rejections
    window.addEventListener('unhandledrejection', () => {});
}


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <CurrUserProvider>
            <ClickedClassProvider>
                <QuizProvider>
                    <App />
                </QuizProvider>
            </ClickedClassProvider>
        </CurrUserProvider>
    </React.StrictMode>,
);
