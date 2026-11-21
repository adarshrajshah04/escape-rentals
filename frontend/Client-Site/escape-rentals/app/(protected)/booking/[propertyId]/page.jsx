import BookingPage from "@/components/booking/bookingPage";

export default async function PropertyBookingPage({ params }) {
  const { propertyId } = await params;
  return <BookingPage propertyId={propertyId} />;
}