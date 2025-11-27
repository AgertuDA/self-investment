# 📘 Self-Investment Web Application v1.0

A web application that helps users manage their allowance, track hobbies, participate in challenges, submit proofs, and grow through personal development activities. The system includes both User and Admin functionalities.

<br>

# 🔗 Live Links

Replace these with your actual links:

Deployed Application: Add link here

Project Video (5–10 min): Add link here

GitHub Repository: Add link here

SRS Document: Add link here

<br>

# 📌 Project Overview

This project implements the functionalities defined in the Software Requirements Specification (SRS) for version 1.0. It includes:

👤 User Features

•	Registration & login
•	Personalization questionnaire (hobbies, interests, allowance)
•	Dashboard displaying:
o	Points earned
o	Day streak
o	Completed hobbies
o	Hobby progress
o	Allowance plan
o	Active challenges
o	Rewards
•	Add / delete hobbies
•	Submit proof for completed hobbies
•	Participate in challenges
•	View rewards and progress


🛠 Admin Features

•	Admin login
•	Dashboard overview:
o	Total users
o	Total admins
o	Total hobbies
o	Verified / Pending / Rejected proofs
•	View all users
•	Create and manage challenges
•	View and verify proofs
•	Logout


<br>

# 📁 Project Structure

Below is the full structure of the project (Frontend + Backend):

```
/project-root
│
├─ frontend/
│   ├─ src/
│   ├─ index.html
│   ├─ package.json
│   ├─ tailwind.config.js
│   ├─ vite.config.ts
│   ├─ tsconfig.json
│   └─ ...
│
├─ server/
│   ├─ config/
│   ├─ controllers/
│   ├─ middleware/
│   ├─ models/
│   ├─ routes/
│   ├─ utils/
│   ├─ scripts/
│   ├─ server.js
│   ├─ package.json
│   └─ render.yaml
│
├─ README.md
└─ LICENSE
```

## 🛠️ Setup Instructions (Local Development)

Follow every step carefully to run this project on your machine.


## 1️⃣ Clone the Repository

```bash
git clone https://github.com/YourUsername/your-repo-name.git
cd your-repo-name
```


## 2️⃣ Install Backend Dependencies

```bash
cd server
npm install
# or
yarn install
```

Create a file named **`.env`** inside the `server` folder and add:

```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/self_investment_db
JWT_SECRET=your_jwt_secret_here
```

> Ensure MongoDB is installed and running if you're using a local database.



## 3️⃣ Start the Backend

Still inside the `server` folder, run:

```bash
npm start
# or
yarn start
```

The backend will run at:

```text
http://localhost:5000
```



## 4️⃣ Install Frontend Dependencies

Open a NEW terminal window:

```bash
cd frontend
npm install
# or
yarn install
```



## 5️⃣ Start the Frontend

Inside the `frontend` folder, run:

```bash
npm run dev
# or
yarn dev
```

Vite will show a local development URL like:

```text
http://localhost:5173
```

Open that in your browser.

## 🎯 How to Use the System

For Users:

1.	Open the frontend link.
2.	Register a new account.
3.	Complete the questionnaire.
4.	Access the dashboard.
5.	Add hobbies, join challenges, or submit proofs.


For Admins:

•  Go to the admin login page.
•  Enter admin email + password.
•  Access the admin dashboard.
•  View users, manage challenges, verify proofs


