import RecipeDetailsPage from "@/components/RecipeDetailsPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <RecipeDetailsPage id={Number(id)} />;
}
