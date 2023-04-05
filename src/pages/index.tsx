import { trpc } from '@/utils/trpc';
import { NextPage } from 'next';

const Home: NextPage = () => {
  const { data } = trpc.photos.useQuery();
  return <div>{JSON.stringify(data?.photos)}</div>;
};

export default Home;
