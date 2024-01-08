import { appRouter } from '@/server/routers/_app';
import { httpBatchLink } from '@trpc/client';

export const serverClientTRPC = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',

      // You can pass any HTTP headers you wish here
      // async headers() {
      //     return {
      //         authorization: ,
      //     };
      // },
    }),
  ],
});
