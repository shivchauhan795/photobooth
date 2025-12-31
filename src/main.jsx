import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StateContext } from './utils/context/stateContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StateContext>
      <App />
    </StateContext>
  </StrictMode>,
)
