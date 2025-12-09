```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import axios from 'axios';

// Configure Axios defaults
if (import.meta.env.PROD) {
    axios.defaults.baseURL = 'https://study-ai-tbst.vercel.app'; // Your Vercel URL
} else {
    axios.defaults.baseURL = 'http://localhost:5001';
}
axios.defaults.withCredentials = true; // CRITICAL: Send cookies with requests

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
