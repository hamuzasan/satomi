import { GoalDetailExperience } from "./goal-detail-experience";

type GoalDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { id } = await params;
  return <GoalDetailExperience goalId={id} />;
}
