import { useListQuery } from '../lib/goalsService';
import GoalItem from './GoalItem';
import Spinner from './Spinner';

function GoalList() {
  const { data: goals = [], isLoading } = useListQuery();

  if (isLoading) return <Spinner />;

  if (goals.length == 0) return <h3>You have not set any goals</h3>;

  return (
    <div className="goals">
      {goals.map((goal) => (
        <GoalItem key={goal._id} goal={goal} />
      ))}
    </div>
  );
}

export default GoalList;
