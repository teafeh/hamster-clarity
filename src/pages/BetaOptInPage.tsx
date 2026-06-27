import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Status =
    | "loading"
    | "success"
    | "alreadyJoined"
    | "error";

export default function BetaOptInPage() {
    const [searchParams] = useSearchParams();

    const [status, setStatus] =
        useState<Status>("loading");

    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage("Invalid beta invitation.");
            return;
        }

        const joinBeta = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/join-beta`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                        },
                        body: JSON.stringify({
                            token,
                        }),
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.error ?? "Unable to join beta."
                    );
                }

                if (result.alreadyJoined) {
                    setStatus("alreadyJoined");
                } else {
                    setStatus("success");
                }
            } catch (err) {
                setStatus("error");

                setMessage(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );
            }
        };

        joinBeta();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-6">
            <div className="max-w-xl w-full text-center">

                <img
                    src="/animations/Hamster.svg"
                    alt="Flow Hamster"
                    className="w-36 md:w-44 mx-auto mb-8 select-none"
                    draggable={false}
                />

                {status === "loading" && (
                    <>
                        <p className="uppercase tracking-[0.25em] text-xs font-semibold text-[#B85C38] mb-3">
                            Checking invitation
                        </p>

                        <h1
                            className="text-4xl md:text-5xl mb-5"
                            style={{
                                fontFamily: "'Fraunces', serif",
                            }}
                        >
                            One moment...
                        </h1>

                        <p className="text-gray-600 leading-8">
                            We're reserving your place in the
                            Flow beta.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <p className="uppercase tracking-[0.25em] text-xs font-semibold text-[#B85C38] mb-3">
                            Welcome aboard
                        </p>

                        <h1
                            className="text-4xl md:text-5xl mb-5"
                            style={{
                                fontFamily: "'Fraunces', serif",
                            }}
                        >
                            🎉 You're officially a Beta Tester
                        </h1>

                        <p className="text-gray-600 leading-8">
                            Thanks for helping build Flow.
                            <br />
                            We'll contact you before launch with
                            early access, sneak peeks and
                            opportunities to shape the product.
                        </p>
                    </>
                )}

                {status === "alreadyJoined" && (
                    <>
                        <p className="uppercase tracking-[0.25em] text-xs font-semibold text-[#B85C38] mb-3">
                            You're already in
                        </p>

                        <h1
                            className="text-4xl md:text-5xl mb-5"
                            style={{
                                fontFamily: "'Fraunces', serif",
                            }}
                        >
                            ✅ Welcome back!
                        </h1>

                        <p className="text-gray-600 leading-8">
                            You're already part of the Flow beta
                            program.
                            <br />
                            There's nothing else you need to do.
                            We'll reach out before launch with
                            updates, early access and exclusive
                            beta opportunities.
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <p className="uppercase tracking-[0.25em] text-xs font-semibold text-[#B85C38] mb-3">
                            Invalid invitation
                        </p>

                        <h1
                            className="text-4xl md:text-5xl mb-5"
                            style={{
                                fontFamily: "'Fraunces', serif",
                            }}
                        >
                            We couldn't verify your invite
                        </h1>

                        <p className="text-gray-600 leading-8">
                            {message}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}