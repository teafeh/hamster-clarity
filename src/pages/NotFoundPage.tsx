import { Link } from 'react-router-dom'
import LottieAnimation from '../components/animation/LottieAnimation'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-6">
      <div className="max-w-lg text-center">
        <LottieAnimation
          src="/animations/error404.lottie"
          className="w-72 h-72 mx-auto"
        />

        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: '#E07B39' }}
        >
          Error 404
        </p>

        <h1
          className="text-4xl font-semibold mb-3"
          style={{
            fontFamily: "'Fraunces', serif",
            color: '#111111',
          }}
        >
          Oops! Hamster couldn't find that page.
        </h1>

        <p
          className="text-sm mb-8"
          style={{ color: '#6B7280' }}
        >
          The page you're looking for may have been moved,
          deleted, or the link may be incorrect.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-opacity"
          style={{
            backgroundColor: '#111111',
            color: '#FAFAF8',
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}