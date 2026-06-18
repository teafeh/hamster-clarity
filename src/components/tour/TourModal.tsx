import { useState } from 'react'
import { tourSteps } from './tourSteps'

type TourModalProps = {
    open: boolean
    onClose: () => void
    onComplete: () => void
}

export default function TourModal({ open, onClose, onComplete }: TourModalProps) {
    const [currentStep, setCurrentStep] = useState(0)

    if (!open) return null

    const step = tourSteps[currentStep]
    const isLastStep = currentStep === tourSteps.length - 1

    const handleNext = () => {
        if (isLastStep) { onComplete(); return }
        setCurrentStep((prev) => prev + 1)
    }

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0))
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
            <div
                className="relative w-full max-w-md rounded-[28px] bg-white p-9 shadow-2xl text-center"
                style={{ animation: 'modalPop .25s cubic-bezier(.34,1.56,.64,1)' }}
            >
                <style>{`
                    @keyframes modalPop {
                        from { opacity: 0; transform: scale(0.88) translateY(12px); }
                        to   { opacity: 1; transform: scale(1) translateY(0); }
                    }
                `}</style>

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
                    aria-label="Close"
                >
                    <span className="text-lg leading-none">×</span>
                </button>

                {/* Icon */}
                <div className="mx-auto mb-5 h-[72px] w-[72px] rounded-3xl bg-orange-50 border border-orange-100 flex items-center justify-center text-4xl">
                    {'🐹'}
                </div>

                {/* Location pill */}
                {'location' in step && step.location && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 border border-gray-200 px-3.5 py-1.5 text-xs font-medium text-gray-500 mb-4">
                        {step.location}
                    </div>
                )}

                {/* Title */}
                <h2
                    className="text-[22px] leading-snug font-semibold text-[#111111] mb-3"
                    style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.3px' }}
                >
                    {step.title}
                </h2>

                {/* Description */}
                <p className="max-w-xs mx-auto text-[15px] leading-relaxed text-gray-500 mb-6">
                    {step.description}
                </p>

                {/* Progress dots */}
                <div className="flex justify-center items-center gap-2 mb-6">
                    {tourSteps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentStep(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
                                    ? 'bg-[#E07B39] w-5'
                                    : 'bg-gray-300 w-2'
                                }`}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-2.5">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="flex-1 h-[46px] rounded-[14px] border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition disabled:opacity-35 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>

                    <button
                        onClick={handleNext}
                        className="flex-[1.4] h-[46px] rounded-[14px] bg-[#E07B39] text-white text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition"
                    >
                        {isLastStep ? 'Finish ✓' : 'Got it →'}
                    </button>
                </div>

                {!isLastStep && (
                    <button
                        onClick={onClose}
                        className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition"
                    >
                        Skip tour
                    </button>
                )}
            </div>
        </div>
    )
}