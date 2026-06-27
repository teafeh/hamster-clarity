import { Link } from 'react-router-dom'


export default function WaitlistNotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-6">
            <div className="max-w-xl text-center">
                <img
                    src="/animations/Hamster.svg"
                    alt="Hamster"
                    className="w-24 md:w-82 mx-auto mb-8 select-none"
                    draggable={false}
                />

                <p
                    className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
                    style={{ color: '#B85C38' }}
                >
                    Early Access
                </p>

                <h1
                    className="text-4xl md:text-5xl font-semibold leading-tight mb-5"
                    style={{
                        fontFamily: "'Fraunces', serif",
                        color: '#111111',
                    }}
                >
                    You're a little early 🐹
                </h1>

                <p
                    className="text-base leading-8 mb-4"
                    style={{ color: '#4B5563' }}
                >
                    We're still putting the finishing touches on Flow.
                </p>

                <p
                    className="text-base leading-8 mb-10"
                    style={{ color: '#6B7280' }}
                >
                    Join the waitlist to get early access, product updates and be among
                    the first businesses to automate bookings, reminders and customer
                    communication with Flow.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-xl px-7 py-3 text-sm font-semibold transition-all duration-200 hover:opacity-90"
                        style={{
                            backgroundColor: '#B85C38',
                            color: '#FFFFFF',
                        }}
                    >
                        Join the Waitlist
                    </Link>

                    <a
                        href="https://www.instagram.com/flowbyhamster"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-xl border px-7 py-3 text-sm font-semibold transition-all duration-200"
                        style={{
                            borderColor: '#E5E7EB',
                            color: '#111111',
                            backgroundColor: '#FFFFFF',
                        }}
                    >
                        Follow our journey
                    </a>
                </div>

                <p
                    className="mt-10 text-sm"
                    style={{ color: '#9CA3AF' }}
                >
                    Flow by Hamster • Launching soon
                </p>
            </div>
        </div>
    )
}