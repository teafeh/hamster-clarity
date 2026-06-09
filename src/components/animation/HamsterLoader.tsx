// HamsterLoader.tsx

import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function HamsterLoader() {
  return (
    <div className="w-40 h-40">
      <DotLottieReact
        src="/animations/hamster.lottie"
        loop
        autoplay
      />
    </div>
  )
}