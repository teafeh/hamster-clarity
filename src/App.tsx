import { AuthProvider } from '@/contexts/AuthContext'
import ComingSoon from '@/pages/ComingSoon'

export default function App() {
  return (
    <AuthProvider>
      <ComingSoon />
    </AuthProvider>
  )
}