import { Button, Page } from '@/components/atoms';
import { trpc } from '@/utils/trpc';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();

  const { mutate, isLoading, isSuccess, data } = trpc.createDB.useMutation();

  const goTo = async () => {
    // Used button instead of next/link as its mentioned button on the first point 0.
    await mutate();
    setTimeout(() => {
      router.push('/galleria');
    }, 1500); // made it sleep show the text!
  };

  const buttonText = isLoading
    ? 'Generating...'
    : isSuccess
    ? data.message === 'db is already generated!'
      ? 'Already generated!'
      : 'Generated!'
    : 'Generate Gallery';

  return (
    <Page className="bg-indigo-100">
      <div className="max-w-7xl mx-auto flex items-center h-screen">
        <div className="shadow-slate-950/10 p-4 w-full max-w-md rounded-xl mx-auto bg-white shadow-xl h-max">
          <Button
            onClick={goTo}
            size={'full'}
            disabled={isLoading}
            variant={isSuccess ? 'primary-success' : 'primary-indigo'}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default Home;
