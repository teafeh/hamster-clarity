type TourStepProps = {
    title: string
    description: string
}

export default function TourStep({
    title,
    description,
}: TourStepProps) {
    return (
        <>
            <h2
                className="text-3xl font-bold mb-4"
                style={{
                    fontFamily: "'Fraunces', serif",
                }}
            >
                {title}
            </h2>

            <p className="text-gray-600 text-lg">
                {description}
            </p>
        </>
    )
}