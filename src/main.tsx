import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {router} from '@/routes';

ReactDOM.createRoot(document.getElementById('root')!).render(<BrowserRouter>{router}</BrowserRouter>);
