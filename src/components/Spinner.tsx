import styles from '~app/components/Spinner.module.css';

function Spinner() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
    </div>
  );
}

export default Spinner;
