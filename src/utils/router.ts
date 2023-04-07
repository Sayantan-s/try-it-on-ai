import { TRPCError, initTRPC } from '@trpc/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
interface PhotoData {
  data: Omit<
    z.CatchallInput<typeof mutationInputValidation>[string],
    'requestedEdit'
  >[];
}

interface ApiResponse {
  id: string;
  urls: {
    regular: string;
  };
}

interface JSONBinApiResponse {
  record: PhotoData;
}

const t = initTRPC.create();

export const dbDirectory = (...args: string[]) =>
  path.resolve(process.cwd(), 'db', ...args);

const dir = dbDirectory('db.json');

const mutationInputValidation = z.object({
  photo_id: z.string().nonempty(),
  url: z.string().nonempty(),
  requestedEdit: z.string().nonempty(),
});

export const appRouter = t.router({
  photos: t.router({
    get: t.procedure.query(async () => {
      try {
        const photos: JSONBinApiResponse = await prodApi('GET');
        return { photos: photos.record.data };
        // process.env.NODE_ENV === 'development'
        //   ? JSON.parse(await fs.readFile(dir, 'utf-8'))
        //   :;
        // return { photos: photos.data };
      } catch (error) {
        console.log('Failed!!!');
        throw new TRPCError({
          code: 'CONFLICT',
          message: (error as Error).message,
          cause: error,
        });
      }
    }),
    update: t.procedure
      .input(mutationInputValidation)
      .mutation(async ({ input }) => {
        //642fb904ebd26539d0a61a4d
        try {
          const photos = await prodApi<JSONBinApiResponse>('GET'); // Not a great practice...
          photos.record.data = photos.record.data.reduce((acc, curr, index) => {
            if (curr.photo_id === input.photo_id)
              acc[index] = { ...input, url: input.url };
            return acc;
          }, photos.record.data);
          await prodApi('PUT', {
            body: JSON.stringify({ data: photos.record.data }),
          });
          //JSON.parse(await fs.readFile(dir, 'utf-8'));
          // photos.data = photos.data.reduce((acc, curr, index) => {
          //   if (curr.photo_id === input.photo_id)
          //     acc[index] = { ...input, url: input.url };
          //   return acc;
          // }, photos.data);
          // await fs.writeFile(dir, JSON.stringify(photos), 'utf-8');
          // return { message: 'File written!' }; // In usual scenarios, using a bucket would have been the case, chose to store the base64 directly as url as mentioned in the assignment!
        } catch (error) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: (error as Error).message,
            cause: error,
          });
        }
      }),
  }),
  createDB: t.procedure.mutation(async () => {
    if (process.env.NODE_ENV === 'production')
      return { message: 'db is already generated!' };
    try {
      await fs.access(dir);
      return { message: 'db is already generated!' } as const;
    } catch (error) {
      await fs.mkdir(dbDirectory());
      const data = await getPhotos<ApiResponse>(50, 25);
      const payload = data.map((picture) => ({
        photo_id: picture.id,
        url: picture.urls.regular,
      }));
      await fs.appendFile(dir, JSON.stringify({ data: payload })); // creates the db.json
      return { message: 'db generated!' } as const;
    }
  }),
});

export type AppRouter = typeof appRouter;

async function api(page: number, per_page: number) {
  const res = await fetch(
    `https://api.unsplash.com/photos?page=${page}&per_page=${per_page}&order_by=latest`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_API_KEY}`,
      },
    }
  );
  return await res.json();
}

export const prodApi = async <TData>(
  method: 'GET' | 'PUT',
  options?: RequestInit
): Promise<TData> => {
  const BinID = `642fb904ebd26539d0a61a4d`;
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BinID}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-MASTER-KEY':
        '$2b$10$0yLCbylmLsYAdOefSO5iA./psg8HbVFnJSCoLRffSnBcrKd6f/gwi',
      'X-Access-Key':
        '$2b$10$2tEiGm/EFZcGjGhgmUYzYOsZoUlx5U6xDxbS6oDHwoXR4NDW55uNK',
      'X-Bin-Private': 'false',
      'X-Bin-Name': 'photos',
    },
    ...options,
  });
  return await res.json();
};

async function getPhotos<TData>(photos: number, per_page: number) {
  const pages = new Array(Math.floor(photos / per_page))
    .fill(true)
    .map((_, index) => api(++index, per_page));
  const remainingPhotos = photos % per_page;
  if (remainingPhotos > 0) {
    pages.push(api(++pages.length, remainingPhotos));
  }
  const data = (await Promise.all<TData[]>(pages)).reduce(
    (acc, payload) => [...acc, ...payload],
    []
  );
  return data;
}
