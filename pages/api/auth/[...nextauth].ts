import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { hash, verify } from '@node-rs/bcrypt';
import { ObjectId } from 'mongodb';
import NextAuth, { type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';

import { getMongoClient } from '../../../lib/mongodb';

declare module 'next-auth' {
  interface User {
    password?: string;
  }
}

type Register = {
  name: string;
  email: string;
  password: string;
  _type: 'register';
};

function isRegister(
  credentials: Record<string, string>
): credentials is Register {
  return '_type' in credentials && credentials._type === 'register';
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
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error('UNPROCESSABLE_ENTITY');
        }

        const client = await getMongoClient();
        const users = client.db().collection<User>('users');
        const user = await users.findOne({ email: credentials.email });

        if (isRegister(credentials)) {
          const id = new ObjectId();
          const user: User = {
            _id: id,
            id: id.toHexString(),
            name: credentials.name,
            email: credentials.email,
          };
          await users.insertOne({
            ...user,
            password: await hash(credentials.password),
          });

          return user;
        }

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
  pages: {
    signIn: '/auth/login',
  },
});
