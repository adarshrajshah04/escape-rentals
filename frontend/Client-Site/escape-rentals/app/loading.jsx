import Loading from "@/components/common/Loading";



export default function PageLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <Loading text="Loading EscapeRentals..." />
    </div>
  );
}