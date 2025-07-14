import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; 
import fetchWithAuth from "../utils/fetchWithAuth";

function LoginPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                username, password
            })
        });

        if(res.ok){
            const data = await res.json();
            login(data);
            navigate('/');
        } else{
            const error = await res.text();
            setMessage({type:'error', text:error});
            setTimeout(() => setMessage(''), 1500);
        }
    };

    return (
        <div style={{padding:30, color:'gold',fontFamily:'Arial, sans-serif'}}>
            <h2>
                Login
            </h2>
            <form onSubmit={handleLogin}>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                <br/><br/>
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
                <br/><br/>
                <button type="submit">Login</button>
            </form>
            {message && (
                <p style={{color: message.type==='error' ? 'red' : 'green'}}>{message.text}</p>
            )}
        </div>
    );
}

export default LoginPage;