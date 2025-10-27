import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/reset.css';
import './styles/index.css';
import './styles/popup.css';
import './admin/styles/admin.css'
import App from './App';
import { AdminAuthProvider } from './context/AdminAuthContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminAuthProvider>
      <App />
    </AdminAuthProvider>
  </BrowserRouter>,
)
