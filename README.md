# AskMJ – Full Stack Q&A Platform

AskMJ is a full-stack Question & Answer web application inspired by platforms like Stack Overflow. It allows users to ask questions, submit answers, upvote/downvote content, and manage their own contributions securely.

---

## 🧠 Tech Stack

### 💻 Frontend
- React (React Router, Context API)
- Material UI (MUI) for styling
- JWT-based authentication
- Protected routes

### 🧠 Backend
- ASP.NET Core Web API (.NET 7)
- RESTful API with Controllers/Services
- MongoDB (via MongoDB Atlas)
- JWT Authentication
- Role-based access (Author-only delete)

### ☁️ Deployment
- **Frontend**: Azure Static Web Apps  
- **Backend**: Azure App Service (.NET Linux)  
- **Database**: MongoDB Atlas (Free tier)

---

## 📂 Folder Structure
AskMJ/
├── backend/ # ASP.NET Core API
│ ├── Controllers/
│ ├── Models/
│ ├── Services/
│ ├── Program.cs
│ ├── appsettings.Template.json
│
├── frontend/ # React frontend
│ ├── src/
│ ├── public/
│ ├── .env.example
│ └── package.json


---

## 🔐 Features

- ✅ User registration & login (JWT)
- ✅ AuthContext in React
- ✅ Ask & answer questions
- ✅ Upvote/downvote answers
- ✅ Delete only your own content
- ✅ Fully responsive UI with MUI
- ✅ Protected routes (`/ask`, `/delete`)
- ✅ Clean, scalable folder structure

---

## 📝 Future Enhancements

✏️ Edit answer/question
🧾 My Questions / My Answers pages
🔍 Search + tag filters
🌑 Dark mode toggle

---

## 🙌 Acknowledgments
Built by [Manoj](https://www.linkedin.com/in/manoj-m-154830241/) to demonstrate full-stack capabilities using modern web technologies and cloud deployment.
