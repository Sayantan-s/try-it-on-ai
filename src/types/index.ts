import { AppRouter } from '@/utils/router';
import { inferRouterInputs } from '@trpc/server';

export type TPhoto = inferRouterInputs<AppRouter>['photos']['update'];
