import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import AppContextProvider from './contexts/AppContext.jsx'
import { UserProvider } from './contexts/UserContext.jsx'  // <-- Thêm dòng này!

createRoot(document.getElementById('root')).render(
  <UserProvider>
  <BrowserRouter>
    <AppContextProvider>
        <App />
    </AppContextProvider>
  </BrowserRouter>,
  </UserProvider>
)
