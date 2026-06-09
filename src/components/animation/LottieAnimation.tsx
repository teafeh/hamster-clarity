// src/components/animation/LottieAnimation.tsx

import { DotLottieReact } from '@lottiefiles/dotlottie-react'

interface Props {
  src: string
  className?: string
}

export default function LottieAnimation({
  src,
  className = 'w-72 h-72',
}: Props) {
  return (
    <div className={className}>
      <DotLottieReact
        src={src}
        autoplay
        loop
      />
    </div>
  )
}