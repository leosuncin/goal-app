import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from 'next-auth';
import { getSession } from 'next-auth/react';
import type { NextHandler } from 'next-connect';

export async function sessionMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    res.status(StatusCodes.FORBIDDEN).json({
      statusCode: StatusCodes.FORBIDDEN,
      code: ReasonPhrases.FORBIDDEN,
      message: 'Missing session',
    });
    return;
  }

  const users = req.db.collection<User>('users');
  const user = await users.findOne(
    { email: session.user.email },
    { projection: { _id: false, id: true, email: true, name: true } }
  );

  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      statusCode: StatusCodes.UNAUTHORIZED,
      code: ReasonPhrases.UNAUTHORIZED,
      message: 'Missing user',
    });
    return;
  }

  req.user = user;

  next();
}
