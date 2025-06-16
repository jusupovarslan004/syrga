import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const photos = [
  { src: '/media/1.jpg', caption: '...' },
  { src: '/media/2.jpg', caption: '...' },
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <App />
);

export default App;

