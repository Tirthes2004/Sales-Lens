import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';

import { Toaster } from 'react-hot-toast';

import '@fontsource/caveat';

import '@fontsource/bungee-shade';

import '@fontsource/press-start-2p';

import '@fontsource/vt323';

import '@fontsource/roboto/400.css';


ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#081120',
          color: '#fff',
          border:
            '1px solid rgba(255,255,255,0.1)',
        },
      }}
    />

    <App />
  </React.StrictMode>
);