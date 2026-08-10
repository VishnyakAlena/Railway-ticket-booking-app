import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'

createRoot(document.getElementById('root')!).render(
  <HashRouter basename="/Railway-ticket-booking-app">
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>
)
