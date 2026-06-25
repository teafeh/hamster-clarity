import { AuthProvider } from '@/contexts/AuthContext'
// import AppRouter from './routes/AppRouter'
import ComingSoon from '@/pages/ComingSoon'

export default function App() {
  return (
    <AuthProvider>
      {/* <AppRouter /> */}
      <ComingSoon />
    </AuthProvider>
  )
}