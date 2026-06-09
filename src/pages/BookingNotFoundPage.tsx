import ErrorState from '@/components/common/ErrorState'

export default function BookingNotFoundPage() {
    return (
        <ErrorState
            title="Booking Not Found"
            description="This booking link may be invalid, expired, or no longer available. Please contact the business for a new booking link."
        />
    )
}