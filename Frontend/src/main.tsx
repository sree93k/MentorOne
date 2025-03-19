
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import {HeroUIProvider} from '@heroui/react'
ReactDOM.createRoot(document.getElementById('root')!).render(
<BrowserRouter>
<HeroUIProvider>
    <App />
  </HeroUIProvider>
</BrowserRouter>
)


