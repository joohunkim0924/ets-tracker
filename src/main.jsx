import React from 'react'
import ReactDOM from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import App from '@/App.jsx'
import '@/index.css'

if (Capacitor.isNativePlatform()) {
  SplashScreen.hide()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
