// src/components/common/ErrorState.tsx

import { Link } from 'react-router-dom'
import ErrorAnimation from '../animation/ErrorAnimation'

interface ErrorStateProps {
  title: string
  description: string
  buttonText?: string
  buttonLink?: string
}

export default function ErrorState({
  title,
  description,
  buttonText,
  buttonLink,
}: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center">

        <div className="flex justify-center -mb-6">
          <ErrorAnimation />
        </div>

        <h1 className="text-3xl font-bold">
          {title}
        </h1>

        <p className="text-gray-500 mt-3">
          {description}
        </p>

        {buttonText && buttonLink && (
          <Link
            to={buttonLink}
            className="inline-flex mt-6 px-5 py-3 rounded-lg bg-black text-white"
          >
            {buttonText}
          </Link>
        )}

      </div>
    </div>
  )
}