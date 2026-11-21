import CategoryProperties from "@/components/category/CategoryProperties";

export default async function CategoryPage({ params }) {
  const { id } = await params;
  return <CategoryProperties categoryId={id} />;
}