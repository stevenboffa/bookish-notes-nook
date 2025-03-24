
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// This ensures the app renders properly in the Lovable preview
const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
