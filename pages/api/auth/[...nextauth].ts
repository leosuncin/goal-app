import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { verify } from '@node-rs/bcrypt';
import NextAuth, { type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';

import { getMongoClient } from '../../../lib/mongodb';

declare module 'next-auth' {
  interface User {
    password?: string;
  }
}

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
    CredentialsProvider({
      name: 'Account',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter password',
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const client = await getMongoClient();
        const users = client.db().collection<User>('users');
        const user = await users.findOne({ email: credentials.email });

        if (!user) return null;

        if (
          typeof user.password === 'string' &&
          !(await verify(credentials.password, user.password))
        ) {
          return null;
        } else {
          delete user.password;
        }

        return user;
      },
    }),
    // ...add more providers here
  ],
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
});
