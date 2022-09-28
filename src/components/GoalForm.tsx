import { useCreateMutation } from '~app/lib/goalsApi';

function GoalForm() {
  const [createGoal] = useCreateMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = (
      event.currentTarget.elements.namedItem('text') as HTMLInputElement
    ).value as string;

    await createGoal({ text });
    (event.target as HTMLFormElement).reset();
  }

  return (
    <section className="form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="goal-text">Goal</label>
          <input id="goal-text" name="text" type="text" required />
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-block">
            Add Goal
          </button>
        </div>
      </form>
    </section>
  );
}

export default GoalForm;
