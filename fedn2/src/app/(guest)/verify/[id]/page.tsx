import Verify from "@/components/auth/verify";

type VerifyPageProps = {
  params: Promise<{ id: string }>;
};

const VerifyPage = async ({ params }: VerifyPageProps) => {
  const { id } = await params;
  return (
        <div className="min-h-screen bg-white text-black ">
      <Verify id={id} />
    </div>
  );
};



export default VerifyPage;
