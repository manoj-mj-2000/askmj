import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../utils/fetchWithAuth";

function RegisterPage(){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                username, email, password
            })
        });
        if(res.ok){
            setMessage({type:"success", text:"User registered successfully"});
            setTimeout(() => navigate("/login"), 1500);
        }
        else{
            const error = (await res).text();
            setMessage({type:'error', text:error});
        }
    };

    return (
        <div style={{padding:30, color:'gold',fontFamily:'Arial, sans-serif'}}>
            <h2>
                Register
            </h2>
            <form onSubmit={handleRegister}>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
                <br /><br />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                <br /><br />
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
                <br /><br />
                <button type="submit">Register</button>
            </form>
            {message && (
                <p style={{ color: message.type === 'error'? 'red':'green' }}>{message.text}</p>
            )}
        </div>
    );

}

export default RegisterPage;