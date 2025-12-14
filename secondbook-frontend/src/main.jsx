// secondbook-frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
);
// This file is correct. If your frontend is still blank, the issue lies in:
// 1. An error within App.jsx or its imported components (like Header/Footer).
// 2. An incorrect file path resolution (check browser console).
// 3. A need for a browser or server restart.