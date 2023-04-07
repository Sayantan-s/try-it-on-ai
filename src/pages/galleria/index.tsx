import { Page } from '@/components/atoms';
import { Card } from '@/components/oragnisms/Card';
import { prodApi } from '@/utils/router';
import { trpc } from '@/utils/trpc';
import { GetServerSideProps } from 'next';

// The experience can be furthur improved using List virtualisation, paginated queries(infinite scrolling).

const Galleria = () => {
  const { data } = trpc.photos.get.useQuery();

  return (
    <Page className="bg-indigo-100 h-screen flex items-center">
      {data ? (
        <div className="max-w-7xl max-h-screen sm:max-h-[700px] overflow-y-scroll mx-auto w-full grid md:grid-cols-2 gap-6 p-4">
          {data.photos.map((photo) => (
            <Card key={photo.photo_id} {...photo} />
          ))}
        </div>
      ) : null}
    </Page>
  );
};

export default Galleria;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // await fs.access(dbDirectory('db.json'));
    await prodApi('GET');
    return {
      props: {},
    };
  } catch (error) {
    return {
      redirect: {
        permanent: true,
        destination: '/',
      },
      props: null,
    };
  }
};
