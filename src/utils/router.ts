import { TRPCError, initTRPC } from '@trpc/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
interface PhotoData {
  data: Omit<
    z.CatchallInput<typeof mutationInputValidation>[string],
    'userId'
  >[];
}

interface ApiResponse {
  id: string;
  urls: {
    regular: string;
  };
}

const t = initTRPC.create();

export const dbDirectory = (...args: string[]) =>
  process.env.NODE_ENV === 'development'
    ? path.resolve(process.cwd(), 'db', ...args)
    : path.join('/tmp', 'db', ...args);

const dir = dbDirectory('db.json');

const mutationInputValidation = z.object({
  photo_id: z.string().nonempty(),
  url: z.string().nonempty(),
  requestedEdit: z.string().nonempty(),
});

export const appRouter = t.router({
  photos: t.router({
    get: t.procedure.query(async () => {
      const photos: PhotoData = JSON.parse(await fs.readFile(dir, 'utf-8'));
      return { photos: photos.data };
    }),
    update: t.procedure
      .input(mutationInputValidation)
      .mutation(async ({ input }) => {
        try {
          const photos: PhotoData = JSON.parse(await fs.readFile(dir, 'utf-8'));
          photos.data = photos.data.reduce((acc, curr, index) => {
            if (curr.photo_id === input.photo_id)
              acc[index] = { ...input, url: input.url };
            return acc;
          }, photos.data);
          await fs.writeFile(dir, JSON.stringify(photos), 'utf-8'); // In usual scenarios, using a bucket would have been the case, chose to store the base64 directly as url as mentioned in the assignment!
        } catch (error) {
          console.log(error);
        }
      }),
  }),
  createDB: t.procedure.mutation(async () => {
    try {
      await fs.access(dir);
      return { message: 'db is already generated!' } as const;
    } catch (error) {
      try {
        await fs.mkdir(dbDirectory()); // Create the db folder
      } catch (error) {
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: (error as Error).message,
          cause: error,
        });
      }
      try {
        const data = await getPhotos<ApiResponse>(50, 25);
        const payload = data.map((picture) => ({
          photo_id: picture.id,
          url: picture.urls.regular,
        }));
        await fs.appendFile(dir, JSON.stringify({ data: payload })); // creates the db.json
        return { message: 'db generated!' } as const;
      } catch (error) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: (error as Error).message,
          cause: error,
        });
      }
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
