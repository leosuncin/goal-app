import { type Db, ObjectId } from 'mongodb';
import type { User } from 'next-auth';

type GoalDocument = {
  text: string;
  createdAt: Date;
  author: ObjectId;
};

type Goal = {
  _id: ObjectId;
  text: string;
  createdAt: Date;
  author: ObjectId | string;
};

export function getGoalService(db: Db) {
  const goals = db.collection<GoalDocument>('goals');

  return {
    async createGoal(text: string, author: User): Promise<Goal> {
      const createdAt = new Date();

      const { insertedId: _id } = await goals.insertOne({
        text,
        createdAt,
        author: ObjectId.createFromHexString(author.id),
      });

      return {
        _id,
        text,
        createdAt,
        author: author.id,
      };
    },
    async listGoals({ author }: { author: User }): Promise<Goal[]> {
      const list: Goal[] = [];
      const cursor = goals.find(
        {
          author: ObjectId.createFromHexString(author.id),
        },
        {
          sort: { createdAt: 1 },
        },
      );

      for await (const goal of cursor) {
        list.push(goal);
      }

      return list;
    },
    async updateGoal(
      id: string,
      { text, author }: { text: string; author: User },
    ): Promise<Goal | undefined> {
      const goal = await goals.findOne({
        _id: ObjectId.createFromHexString(id),
        author: ObjectId.createFromHexString(author.id),
      });

      if (!goal) return undefined;

      const result = await goals.updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: { text } },
      );

      if (result.modifiedCount === 0) {
        return goal;
      } else {
        return { ...goal, text };
      }
    },
    async deleteGoal(id: string, author: User): Promise<number> {
      const result = await goals.deleteOne({
        _id: ObjectId.createFromHexString(id),
        author: ObjectId.createFromHexString(author.id),
      });

      return result.deletedCount;
    },
  };
}
