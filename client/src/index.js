import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18+
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error(
    'Root element with id "root" not found. Ensure it exists in your index.html.'
  );
}
