import { initTRPC } from '@trpc/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
interface PhotoData {
  data: Omit<
    z.CatchallInput<typeof mutationInputValidation>[string],
    'userId'
  >[];
}

const t = initTRPC.create();

const dbDirectory = (...args: string[]) =>
  path.resolve(process.cwd(), 'db', ...args);

const mutationInputValidation = z.object({
  photo_id: z.string().nonempty(),
  url: z.string().nonempty(),
  requestedEdit: z.string().nonempty(),
});

export const appRouter = t.router({
  photos: t.router({
    get: t.procedure.query(async () => {
      const dir = dbDirectory('db.json');
      const photos: PhotoData = JSON.parse(await fs.readFile(dir, 'utf-8'));
      return { photos: photos.data };
    }),
    update: t.procedure
      .input(mutationInputValidation)
      .mutation(async ({ input }) => {
        try {
          const dir = dbDirectory('db.json');
          const photos: PhotoData = JSON.parse(await fs.readFile(dir, 'utf-8'));
          photos.data = photos.data.reduce((acc, curr, index) => {
            if (curr.photo_id === input.photo_id) acc[index] = input;
            return acc;
          }, photos.data);
          await fs.writeFile(dir, JSON.stringify(photos), 'utf-8');
        } catch (error) {
          console.log(error);
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
