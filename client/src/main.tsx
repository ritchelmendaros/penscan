import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App.tsx';
import { CurrUserProvider } from './Components/Context/UserContext.tsx';
import { ClickedClassProvider } from './Components/Context/ClassContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <CurrUserProvider>
            <ClickedClassProvider>
                <App />
            </ClickedClassProvider>
        </CurrUserProvider>
    </React.StrictMode>,
);
