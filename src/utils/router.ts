import { initTRPC } from '@trpc/server';
import fs from 'node:fs/promises';
import path from 'node:path';

interface PhotoData {
  data: Record<'url' | 'id', string>[];
}

const t = initTRPC.create();

export const appRouter = t.router({
  photos: t.procedure.query(async () => {
    const dbDirectory = path.resolve(process.cwd(), 'db', 'db.json');
    const payload: PhotoData = JSON.parse(
      await fs.readFile(dbDirectory, 'utf-8')
    );
    return { photos: payload.data };
  }),
});

export type AppRouter = typeof appRouter;
