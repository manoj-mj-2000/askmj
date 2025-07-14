import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AnswerSection from './AnswerSection';
import fetchWithAuth from "../utils/fetchWithAuth";
import { useAuth } from '../context/AuthContext'; 
import styles from './ViewQuestions.module.css';

function ViewQuestionPage(){
    const {id} = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const { user } = useAuth();

    useEffect(() =>{
        fetch(`${process.env.REACT_APP_API_URL}/api/questions/${id}`)
            .then(res => res.json())
            .then(data => setQuestion(data))
            .catch(err => console.error('Error loading question'));

        fetch(`${process.env.REACT_APP_API_URL}/api/answers/question/${id}`)
            .then(res => res.json())
            .then(data => setAnswers(data))
            .catch(err => console.error('Error loading answers'));

    }, [id]);

    const handleVote = async (answerId, type, voteChange) =>{
        if(!user){
            alert("Login First");
            return;
        }
        if(voteChange === 0 && type === 'down'){
            return;
        }
        voteChange = type === 'up' ? voteChange + 1 : voteChange - 1;
        const res = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/answers/${answerId}/vote?voteChange=${voteChange}`, {
            method:'PUT'
        });
        if(res.ok){
            setAnswers(prev => prev.map(a => a.id === answerId ?
            {
                ...a,
                votes: voteChange
            } : a ));
        }else{
            console.error('Voting Failed');
        }
    }

    const handleSubmit = async (answerText) => {
        if(!user){
            alert("Login First");
            return;
        }
        const res = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/answers`, {
           method: 'POST',
           headers: {
            'Content-Type': 'application/json'
           },
           body: JSON.stringify({
            content: answerText,
            questionId: id,
            userid: user.userId,
            username: user.username
           })
        });
        if(res.ok){
            const saved = await res.json();
            setAnswers(prev => [...prev, saved]);
        }
    };

    const handleDeleteQuestion = async () => {
        if(!window.confirm("Are you confirm to delete the question?")) return;
        
        const res = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/questions/${id}`,{
            method:'DELETE'
        });
        if(res.ok){
            alert("Question Deleted");
            navigate('/');
        }
        else{
            alert("Failed to delete question.");
        }
    };

    const handleDeleteAnswer = async (id) => {
        const res = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/answers/${id}`, {
            method:'DELETE'
        });
        if(res.ok){
            setAnswers(prev => prev.filter(a=>a.id !== id));
        } else{
            alert("Failed to delete answer");
        }
    };

    if (!question) return <div>Loading...</div>;
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Question: {question.title}</h2>
            <p className={styles.description}>{question.description}</p>
            <small className={styles.meta}>
                By {question.username} on {new Date(question.createdTime).toLocaleString()}
            </small>

            {user && user.userId === question.userId && (
                <button onClick={handleDeleteQuestion} className={styles.deleteButton}>
                🗑️ Delete
                </button>
            )}

            <AnswerSection
                answers={answers}
                onSubmit={handleSubmit}
                onVote={handleVote}
                onDelete={handleDeleteAnswer}
            />
        </div>
    );
}

export default ViewQuestionPage;