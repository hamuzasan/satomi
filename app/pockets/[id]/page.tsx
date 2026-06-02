import { PocketDetailExperience } from "./pocket-detail-experience";

export default async function PocketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PocketDetailExperience pocketId={id} />;
}
