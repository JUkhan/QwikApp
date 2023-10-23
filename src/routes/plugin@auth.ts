
import type { Provider } from '@auth/core/providers';
import CredentialsProvider from '@auth/core/providers/credentials';
import { serverAuth$ } from '@builder.io/qwik-auth';
import prisma from "~/lib/prismaClient";

export const { useAuthSignin, useAuthSignout, useAuthSession, onRequest } = serverAuth$(
  () => {
    return ({
      secret: process.env.AUTH_SECRET,
      trustHost: true,
      providers: [
        CredentialsProvider({
          name: 'Login',
          authorize: async (credentials) => {
            
            const user = await prisma.user.findFirst({
              where: { name: credentials.username! }
            })
            if (user) {
              if (user.password === credentials.password) {
                return user as any
              }
            }
            return null;
          },

          /*credentials: {
            username: { label: 'Username', type: 'text' },
            password: { label: 'Password', type: 'password' },
          },*/
        }),
      ] as Provider[],
      pages: {
        signIn: '/auth/signin',
        //signOut: '/auth/signout',
        error: '/auth/error',
        //verifyRequest: '/auth/verify-request',
        //newUser: '/auth/new-user'
      }
    })
  });
