import Verify from "@/components/auth/verify";

type VerifyPageProps = {
  params: Promise<{ id: string }>;
};

const VerifyPage = async ({ params }: VerifyPageProps) => {
  const { id } = await params;
  return <Verify id={id} />;
};

export default VerifyPage;
