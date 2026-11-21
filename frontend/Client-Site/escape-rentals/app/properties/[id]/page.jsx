import SingleProperty from "@/components/common/SingleProperty";

export default async function PropertyPage({ params }) {
  const { id } = await params;
  return <SingleProperty propertyId={id} />;
}