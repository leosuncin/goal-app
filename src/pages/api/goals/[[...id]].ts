import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';

import { getGoalService } from '~app/lib/goalService';
import {
  databaseMiddleware,
  validateObjectIdMiddleware,
} from '~app/lib/mongodb';
import { sessionMiddleware } from '~app/lib/session';

async function createGoalHandler(req: NextApiRequest, res: NextApiResponse) {
  const { text } = req.body;
  const { user } = req;

  if (!text) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      code: ReasonPhrases.UNPROCESSABLE_ENTITY,
      message: 'Validation errors',
      errors: {
        text: ['Please add a text value'],
      },
    });
    return;
  }

  const goal = await getGoalService(req.db).createGoal(text, user);

  res.status(StatusCodes.CREATED).json(goal);
}

async function listGoalsHandler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req;
  const list = await getGoalService(req.db).listGoals({ author: user });

  res.json(list);
}

async function updateGoalHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.params;
  const { text } = req.body;
  const { user } = req;

  if (typeof text !== 'string') {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      code: ReasonPhrases.UNPROCESSABLE_ENTITY,
      message: 'Validation errors',
      errors: {
        text: ['The text value should be a string'],
      },
    });
    return;
  }

  const goal = await getGoalService(req.db).updateGoal(id, {
    text,
    author: user,
  });

  if (!goal) {
    res.status(StatusCodes.NOT_FOUND).json({
      statusCode: StatusCodes.NOT_FOUND,
      code: ReasonPhrases.NOT_FOUND,
      message: `There isn't any goal with id: ${id}`,
    });
    return;
  }

  res.json(goal);
}

async function deleteGoalHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.params;
  const { user } = req;
  const result = await getGoalService(req.db).deleteGoal(id, user);

  if (result === 0) {
    res.status(StatusCodes.NOT_FOUND).json({
      statusCode: StatusCodes.NOT_FOUND,
      code: ReasonPhrases.NOT_FOUND,
      message: `There isn't any goal with id: ${id}`,
    });
    return;
  }

  res.status(StatusCodes.NO_CONTENT).send(undefined);
}

export default nc({ attachParams: true })
  .use(databaseMiddleware, sessionMiddleware)
  .post('/api/goals', createGoalHandler)
  .get('/api/goals', listGoalsHandler)
  .put('/api/goals/:id', validateObjectIdMiddleware, updateGoalHandler)
  .delete('/api/goals/:id', validateObjectIdMiddleware, deleteGoalHandler);
