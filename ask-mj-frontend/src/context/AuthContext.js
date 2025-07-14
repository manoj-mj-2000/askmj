import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('userId');
        return token ? {username, userId, token} : null;
    });
    const navigate = useNavigate();
    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('userId', userData.userId);
        setUser(userData);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/');
    }; 

    return (
        <AuthContext.Provider value={{user, login, logout, isLoggedIn: !!user}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
};