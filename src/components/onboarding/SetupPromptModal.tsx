import { Link } from 'react-router-dom'
import LottieAnimation from '@/components/animation/LottieAnimation'

type SetupPromptModalProps = {
    open: boolean
    onClose: () => void
}

const setupSteps = [
    { icon: '🏢', label: 'Business profile', sub: 'Basic Information about your business', done: true },
    { icon: '🕐', label: 'Operating hours', sub: 'When you\'re open', done: false },
    { icon: '✂️', label: 'First service', sub: 'What you offer', done: false },
]

export default function SetupPromptModal({ open, }: SetupPromptModalProps) {
    if (!open) return null

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

                {/* <button
                    onClick={onClose}
                    className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
                    aria-label="Close"
                >
                    <span className="text-lg leading-none">×</span>
                </button> */}

                {/* Animation */}
                <div className="flex justify-center mb-5">
                    <LottieAnimation
                        src="/animations/onboarding.lottie"
                        className="w-28 h-28"
                    />
                </div>

                <h2
                    className="text-[22px] leading-snug font-semibold text-[#111111] mb-2"
                    style={{ fontFamily: "'Fraunces', serif", letterSpacing: '-0.3px' }}
                >
                    Finish setting up UseFlow
                </h2>

                <p className="text-[14px] leading-relaxed text-gray-500 mb-6 max-w-xs mx-auto">
                    Complete these steps to start accepting bookings.
                </p>

                {/* Checklist */}
                <div className="flex flex-col gap-2.5 text-left mb-6">
                    {setupSteps.map((s) => (
                        <div
                            key={s.label}
                            className={`flex items-center gap-3 rounded-[14px] border px-4 py-3 transition ${s.done
                                    ? 'bg-orange-50 border-orange-100'
                                    : 'bg-gray-50 border-gray-100 opacity-60'
                                }`}
                        >
                            <span className="text-xl">{s.icon}</span>
                            <div>
                                <div className="text-sm font-medium text-gray-800">{s.label}</div>
                                <div className="text-xs text-gray-400">{s.sub}</div>
                            </div>
                            <div className="ml-auto text-lg">
                                {s.done
                                    ? <span className="text-[#E07B39]">✓</span>
                                    : <span className="text-gray-300">○</span>
                                }
                            </div>
                        </div>
                    ))}
                </div>

                <Link
                    to="/onboarding"
                    className="flex items-center justify-center gap-2 w-full h-[46px] rounded-[14px] bg-[#E07B39] text-white text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition"
                >
                    Complete Setup <span>→</span>
                </Link>
            </div>
        </div>
    )
}