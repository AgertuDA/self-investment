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

project/
├── frontend/
│ ├── src/
│ ├── index.html
│ ├── package.json
│ ├── vite.config.ts
│ ├── tailwind.config.js
│ ├── tsconfig.json
│ └── README.md
│
└── server/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── scripts/
├── utils/
├── server.js
├── package.json
└── render.yaml
