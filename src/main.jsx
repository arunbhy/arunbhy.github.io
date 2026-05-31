import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import AppRouter from './AppRouter.jsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <HashRouter>
          <AppRouter />
        </HashRouter>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
