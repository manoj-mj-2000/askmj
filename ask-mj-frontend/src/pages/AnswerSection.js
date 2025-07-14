import React, {useEffect, useState} from "react";
import { useAuth } from '../context/AuthContext'; 
import styles from './AnswerSection.module.css';

function AnswerSection({answers, onSubmit, onVote, onDelete}){
    const [newAnswer, setNewAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!user){
            alert("Login First");
            setNewAnswer('');
            return;
        }
        
        if(newAnswer.trim().length < 10){
            setMessage({type:'error', text:'Answer must have 10 characters'});
            setTimeout(() => setMessage(null), 5000);
            return;
        }

        setLoading(true);
        await onSubmit(newAnswer);
        setLoading(false);
        setNewAnswer('');
        setMessage({type:'success', text:'Answer submitted successfully'});
        setTimeout(() => setMessage(null), 5000);
    };

    const handleDeleteAnswer = (id) =>{
        if(window.confirm("Are you delete this answer?")){
            onDelete(id);
        }
    };

    return (

<div>
  <h3>Submit Your Answer</h3>
  <form onSubmit={handleSubmit} className={styles.formContainer}>
    <textarea
      placeholder="Type your answer here..."
      rows={5}
      onChange={(e) => setNewAnswer(e.target.value)}
      className={styles.textarea}
      value={newAnswer}
      required
    />
    
    {message && (
      <p className={styles.message} style={{ color: message.type === 'success' ? 'green' : 'red' }}>
        {message.text}
      </p>
    )}
    <button type="submit" disabled={loading} className={styles.button}>
      {loading ? 'Submitting...' : 'Submit Answer'}
    </button>
  </form>

  <hr style={{ margin: '30px 0' }} />
  <h3>Answers</h3>
  {answers.length <= 0 ? (
    <p>No Answers yet...</p>
  ) : (
    <ul className={styles.answerList}>
      {answers.map(a => (
        <li key={a.id} className={styles.answerItem}>
          <p>{a.content}</p>
          <small className={styles.answerMeta}>
            By {a.username} on {new Date(a.createdTime).toLocaleString()}
          </small>

          {user && user.userId === a.userId && (
            <button onClick={() => handleDeleteAnswer(a.id)} className={styles.button} style={{ marginLeft: 10 }}>
              🗑️ Delete
            </button>
          )}
          <div className={styles.voteButtons}>
            <button onClick={() => onVote(a.id, 'up', a.votes)}>⬆️</button>
            <span>{a.votes}</span>
            <button onClick={() => onVote(a.id, 'down', a.votes)}>⬇️</button>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

    );

}

export default AnswerSection;