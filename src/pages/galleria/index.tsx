import { Page } from '@/components/atoms';
import { Card } from '@/components/oragnisms/Card';
import { trpc } from '@/utils/trpc';

const Galleria = () => {
  const { data } = trpc.photos.get.useQuery();

  return (
    <Page className="bg-indigo-100 h-screen flex items-center">
      {data ? (
        <div className="max-w-7xl max-h-[700px] overflow-y-scroll mx-auto w-full grid grid-cols-2 gap-6">
          {data.photos.map((photo) => (
            <Card key={photo.photo_id} {...photo} />
          ))}
        </div>
      ) : null}
    </Page>
  );
};

export default Galleria;
