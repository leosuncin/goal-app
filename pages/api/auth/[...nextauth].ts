import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

import { getMongoClient } from '../../../lib/mongodb';

export default NextAuth({
  adapter: MongoDBAdapter(getMongoClient()),
  // Configure one or more authentication providers
  providers: [
    EmailProvider({
      name: 'Magic link',
      secret: process.env.NEXTAUTH_SECRET,
      from: process.env.EMAIL_FROM,
      server: process.env.EMAIL_SERVER ?? {
        host: 'localhost',
        port: 1025,
        secure: false,
        ignoreTLS: true,
      },
    }),
    // ...add more providers here
  ],
  debug: process.env.NODE_ENV === 'development',
});
