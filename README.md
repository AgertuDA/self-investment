📘 Self-Investment Web Application v1.0

A web application that helps users manage their allowance, track hobbies, participate in challenges, submit proofs, and grow through personal development activities. The system includes both User and Admin functionalities.

🔗 Live Links

Replace these with your actual links:

Deployed Application: Add link here

Project Video (5–10 min): Add link here

GitHub Repository: Add link here

SRS Document: Add link here

📌 Project Overview

This project implements the functionalities defined in the Software Requirements Specification (SRS) for version 1.0. It includes:

👤 User Features

Registration & login

Personalization questionnaire (hobbies, interests, allowance)

Dashboard displaying:

Points earned

Day streak

Completed hobbies

Hobby progress

Allowance plan

Active challenges

Rewards

Add / delete hobbies

Submit proof for completed hobbies

Participate in challenges

View rewards and progress

🛠 Admin Features

Admin login

Dashboard overview:

Total users

Total admins

Total hobbies

Verified / Pending / Rejected proofs

View all users

Create and manage challenges

View and verify proofs

Logout

📂 Project Structure
/
├─ frontend/
│  ├─ src/
│  ├─ index.html
│  ├─ package.json
│  └─ ...
│
├─ server/
│  ├─ config/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ utils/
│  ├─ server.js
│  └─ package.json
│
└─ README.md

🛠️ Setup Instructions (Local Development)

Follow every step carefully to run this project on your machine.

1️⃣ Clone the Repository
git clone https://github.com/YourUsername/your-repo-name.git
cd your-repo-name

2️⃣ Install Backend Dependencies
cd server
npm install
# or
# yarn install


Create a file named .env inside the server folder and add:

PORT=5000
MONGO_URI=mongodb://localhost:27017/self_investment_db
JWT_SECRET=your_jwt_secret_here


Make sure MongoDB is installed and running if you're using a local database.

3️⃣ Start the Backend

Still inside the server folder:

npm start
# or
# yarn start


The server should run on:

http://localhost:5000

4️⃣ Install Frontend Dependencies

Open a new terminal and run:

cd frontend
npm install
# or
# yarn install

5️⃣ Start the Frontend

From inside the frontend folder:

npm run dev
# or
# yarn dev


Vite will give you a link like:

http://localhost:5173


Open that in your browser.

🎯 How to Use the System
For Users:

Open the frontend link.

Register a new account.

Complete the questionnaire.

Access the dashboard.

Add hobbies, join challenges, or submit proofs.

For Admins:

Admin accounts can be created manually in the database or through any provided seed script.

Once an admin account exists:

Go to the admin login page.

Enter admin email + password.

Access the admin dashboard.

View users, manage challenges, verify proofs.
