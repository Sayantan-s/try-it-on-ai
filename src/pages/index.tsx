import { Button, Page } from '@/components/atoms';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();

  const goTo = () => {
    // Used button instead of next/link as its mentioned button on the first point 0.
    router.push('/galleria');
  };

  return (
    <Page className="bg-indigo-100">
      <div className="max-w-7xl mx-auto flex items-center h-screen">
        <div className="shadow-slate-950/10 p-4 w-full max-w-md rounded-xl mx-auto bg-white shadow-xl h-max">
          <Button onClick={goTo} size={'full'}>
            Generate Gallery
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default Home;
