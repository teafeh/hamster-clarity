import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
// import AppRouter from './routes/AppRouter'

import ComingSoon from '@/pages/ComingSoon'
import NotFoundPage from '@/pages/WaitlistNotFoundPage'
import BetaOptInPage from './pages/BetaOptInPage'

export default function App() {
  return (
    <AuthProvider>
      {/* <AppRouter /> */}
       <Routes>
        <Route path="/" element={<ComingSoon />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/beta" element={<BetaOptInPage />} />
      </Routes>
    </AuthProvider>
  )
}
