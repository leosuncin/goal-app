import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import {
  MongoClient,
  ObjectId,
  type Db,
  type MongoClientOptions,
} from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';

declare global {
  var mongo: MongoClient | undefined;
}

declare module 'next' {
  export interface NextApiRequest {
    db: Db;
    params: Record<string, string>;
  }
}

if (!process.env.MONGO_URL) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGO_URL;
const options: MongoClientOptions = {};

export async function getMongoClient() {
  if (!global.mongo) {
    global.mongo = new MongoClient(uri, options);
  }

  // It is okay to call connect() even if it is connected
  // using node-mongodb-native v4 (it will be no-op)
  // See: https://github.com/mongodb/node-mongodb-native/blob/4.0/docs/CHANGES_4.0.0.md
  await global.mongo.connect();

  return global.mongo;
}

export function validateObjectIdMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      statusCode: StatusCodes.BAD_REQUEST,
      code: ReasonPhrases.BAD_REQUEST,
      message: 'The id must be a valid ObjectId',
    });
  } else {
    next();
  }
}

export async function databaseMiddleware(
  req: NextApiRequest,
  _res: NextApiResponse,
  next: NextHandler
) {
  const client = await getMongoClient();

  req.db = client.db(); // this use the database specified in the MONGO_URL (after the "/")

  return next();
}
