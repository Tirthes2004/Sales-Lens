{/* this is our main file we are importing everything here from index.css file to App.jsx */}

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';
{/* use this alternative for alert */}
import { Toaster } from 'react-hot-toast';
{/* importing all installed fonts */}
import '@fontsource/caveat';

import '@fontsource/bungee-shade';

import '@fontsource/press-start-2p';

import '@fontsource/vt323';

import '@fontsource/roboto/400.css';

{/* our main code where we selecting element by id = root and using .render() , <App />  to render all code into the index.html file id=root container. strictmode used to avoid bugs and old patterns b   */}

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