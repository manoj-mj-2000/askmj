import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import fetchWithAuth from '../utils/fetchWithAuth';
import styles from './HomePage.module.css';

function HomePage(){
    const [questions, setQuestions] = useState([]);
    
    useEffect(() => {

        //Load dummy questions in the home page.
        fetch(`${process.env.REACT_APP_API_URL}/api/questions`)
        .then(res => res.json())
        .then(data => setQuestions(data))
        .catch(err => console.error('Error occurred in loading: ',err));

    },[]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>All Questions</h1>

            <ul className={styles.questionList}>
                {questions.length === 0 ? (
                <p className={styles.emptyMessage}>No Questions found</p>
                ) : (
                questions.map((q) => (
                    <li key={q.id} className={styles.questionItem}>
                    <h3>{q.title}</h3>
                    <p>{q.description}</p>
                    <Link to={`/question/${q.id}`} className={styles.viewLink}>
                        🔍 View
                    </Link>
                    </li>
                ))
                )}
            </ul>
        </div>
    );
}

export default HomePage;