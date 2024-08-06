import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App.tsx';
import { CurrUserProvider } from './Components/Context/UserContext.tsx';
import { ClickedClassProvider } from './Components/Context/ClassContext.tsx';
import { QuizProvider } from './Components/Context/QuizContext.tsx';

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
