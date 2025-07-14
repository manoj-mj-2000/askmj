import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from '../utils/fetchWithAuth';
import { useAuth } from '../context/AuthContext'; 
import styles from './AskQuestions.module.css';

function AskQuestionPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // prevents from page loading

        // const newQuestion = {
        //     id: Date.now().toString(),
        //     title,
        //     description,
        //     tags: tags.split(',').map(tag=>tag.trim())
        // }

        // API call section
        // console.log("New Question: ", newQuestion);
        const userId = user.userId;
        const username = user.username;
        fetchWithAuth(`${process.env.REACT_APP_API_URL}/api/questions`, {
            method: 'POST',
            body: JSON.stringify({
                title,
                description,
                tags: tags.split(',').map(tag=>tag.trim()),
                userId,
                username
            })
        });

        //Navigate back to home page
        // alert("Question Submitted");
        navigate('/');
        window.location.reload();
    };

    return(

        <div className={styles.container}>
            <h1>Ask a New Question</h1>
            <form onSubmit={handleSubmit} className={styles.formBox}>
                <div className={styles.formGroup}>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                    <label>Description:</label>
                    <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                    <label>Tags (Comma separated):</label>
                    <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} required />
                </div>
                <button type="submit">Submit Question</button>
            </form>
        </div>

    );
}

export default AskQuestionPage;