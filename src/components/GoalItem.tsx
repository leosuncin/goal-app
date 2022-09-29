import { useRemoveMutation, type Goal } from '~app/lib/goalsApi';

export type GoalItemProps = {
  goal: Goal;
};

const dateFormat = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeStyle: 'medium',
});

function GoalItem({ goal }: GoalItemProps) {
  const [removeGoal] = useRemoveMutation();
  const createdAt = dateFormat.format(new Date(goal.createdAt));

  return (
    <div className="goal">
      <time dateTime={goal.createdAt}>{createdAt}</time>

      <h2>{goal.text}</h2>

      <button
        type="button"
        className="close"
        aria-label="Remove goal"
        onClick={() => removeGoal(goal._id)}
      >
        X
      </button>
    </div>
  );
}

export default GoalItem;
