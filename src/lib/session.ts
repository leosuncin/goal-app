import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import type { NextHandler } from 'next-connect';

export async function sessionMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler,
) {
  const jwt = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!jwt || !jwt.sub) {
    res.status(StatusCodes.FORBIDDEN).json({
      statusCode: StatusCodes.FORBIDDEN,
      code: ReasonPhrases.FORBIDDEN,
      message: 'Missing session',
    });
    return;
  }

  const users = req.db.collection<User>('users');
  const user = await users.findOne(
    { email: jwt.email },
    { projection: { _id: true, email: true, name: true } },
  );

  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      statusCode: StatusCodes.UNAUTHORIZED,
      code: ReasonPhrases.UNAUTHORIZED,
      message: 'Missing user',
    });
    return;
  }

  req.user = {
    email: user.email,
    id: user._id.toHexString(),
    name: user.name,
  };

  next();
}
