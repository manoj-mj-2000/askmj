import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from './context/AuthContext';
import styles from './App.module.css';
import HomePage from "./pages/homePage";
import AskQuestions from "./pages/askQuestions"
import ViewQuestionPage from "./pages/viewQuestionPage"
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {

  const { user, isLoggedIn, logout } = useAuth();
  return (

    <>
    <nav className={styles.navbar}>
      <Link to="/" className={styles.navLink}>Home</Link>

      {isLoggedIn && (
        <Link to="/ask" className={styles.navLink}>Ask a Question</Link>
      )}

      {!isLoggedIn ? (
        <>
          <Link to="/login" className={styles.navLink}>Login</Link>
          <Link to="/register" className={styles.navLink}>Register</Link>
        </>
      ) : (
        <>
          <span className={styles.welcomeText}>Welcome, {user.username}</span>
          <button onClick={logout} className={styles.logoutButton}>Logout</button>
        </>
      )}
    </nav>

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/ask" element={<AskQuestions />} />
      <Route path="/question/:id" element={<ViewQuestionPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  </>

  );
}

export default App;