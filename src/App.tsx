import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { NavigationProvider } from './contexts/NavigationContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Settings } from './pages/Settings'
import { Success } from './pages/Success'
import { AppWrapper } from './pages/AppWrapper'

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/success" element={<Success />} />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/*"
              element={
                <ProtectedRoute>
                  <AppWrapper />
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          </Routes>
        </NavigationProvider>
      </Router>
    </AuthProvider>
  )
}

export default App