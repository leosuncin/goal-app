import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import nc from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';

import {
  databaseMiddleware,
  validateObjectIdMiddleware,
} from '../../../lib/mongodb';

export type Goal = {
  text: string;
  createdAt: Date;
};

async function createGoalHandler(req: NextApiRequest, res: NextApiResponse) {
  const { text } = req.body;
  const createdAt = new Date();

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

  const goals = req.db.collection<Goal>('goals');

  const { insertedId: _id } = await goals.insertOne({ text, createdAt });

  res.status(StatusCodes.CREATED).json({ _id, text, createdAt });
}

async function listGoalsHandler(req: NextApiRequest, res: NextApiResponse) {
  const goals = req.db.collection<Goal>('goals');
  const list: Goal[] = [];

  const cursor = goals.find(
    {},
    {
      sort: { createdAt: 1 },
    }
  );

  if ((await goals.estimatedDocumentCount()) === 0) {
    res.status(StatusCodes.NO_CONTENT).send(undefined);
    return;
  }

  while (await cursor.hasNext()) {
    const goal = await cursor.next();
    list.push(goal!);
  }

  res.json(list);
}

async function updateGoalHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.params;
  const { text } = req.body;

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

  const goals = req.db.collection<Goal>('goals');

  const goal = await goals.findOne({
    _id: ObjectId.createFromHexString(id),
  });

  if (!goal) {
    res.status(StatusCodes.NOT_FOUND).json({
      statusCode: StatusCodes.NOT_FOUND,
      code: ReasonPhrases.NOT_FOUND,
      message: `There isn't any goal with id: ${id}`,
    });
    return;
  }

  const result = await goals.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    { $set: { text } }
  );

  if (result.modifiedCount === 0) {
    res.status(StatusCodes.NOT_MODIFIED).send(undefined);
    return;
  }

  res.json({ ...goal, text });
}

async function deleteGoalHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.params;

  const goals = req.db.collection<Goal>('goals');

  const result = await goals.deleteOne({
    _id: ObjectId.createFromHexString(id),
  });

  if (result.deletedCount === 0) {
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
  .use(databaseMiddleware)
  .post('/api/goals', createGoalHandler)
  .get('/api/goals', listGoalsHandler)
  .put('/api/goals/:id', validateObjectIdMiddleware, updateGoalHandler)
  .delete('/api/goals/:id', validateObjectIdMiddleware, deleteGoalHandler);
