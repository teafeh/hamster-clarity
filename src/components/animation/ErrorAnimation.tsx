// src/components/animation/ErrorAnimation.tsx

import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function ErrorAnimation() {
  return (
    <div className="w-48 h-48 mx-auto">
      <DotLottieReact
        src="/animations/error404.lottie"
        loop
        autoplay
      />
    </div>
  )
}