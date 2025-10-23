import API from '../../api';
import styles from '../../styles/HabitItem.module.css';


const HabitItem = ({ habit }) => {
  const handleComplete = async () => {
    try {
      await API.put(`/habits/${habit._id}`);
      alert('Habit completed!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.card}>
       <h3>{habit.name}</h3>
       <p>Streak: {habit.streak}</p>
       <button className={styles.button} onClick={handleComplete}>Complete</button>
    </div>

  );
};

export default HabitItem;