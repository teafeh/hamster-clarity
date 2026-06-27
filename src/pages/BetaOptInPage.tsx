import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Status = "loading" | "success" | "error";

export default function BetaOptInPage() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<Status>("loading");
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
                    throw new Error(result.error ?? "Unable to join beta.");
                }

                setStatus("success");
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
            <div className="max-w-lg w-full text-center">
                {status === "loading" && (
                    <>
                        <h1
                            className="text-4xl mb-4"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            Joining Beta...
                        </h1>

                        <p className="text-gray-500">
                            Please wait while we reserve your spot.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="text-6xl mb-6">🎉</div>

                        <h1
                            className="text-4xl mb-5"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            You're officially a Beta Tester
                        </h1>

                        <p className="text-gray-600 leading-8">
                            Thanks for helping build Flow.
                            <br />
                            We'll contact you before launch with early access,
                            sneak peeks and opportunities to shape the product.
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="text-6xl mb-6">😕</div>

                        <h1
                            className="text-4xl mb-5"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            Something went wrong
                        </h1>

                        <p className="text-gray-600">
                            {message}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}