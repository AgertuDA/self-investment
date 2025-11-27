# Simple Authentification System (include password reset) with MERN stack : 

MERN APP for registering users with mongodb and authentication using a JWT (json web token), It includes also a password reset functionality.



# Configuration :
Create a ```config.env``` file in the root directory and fill it with the following informations :

```
PORT=8000

DATABASE_CONNECTION="Your DB URI"

JWT_SECRET="Your JWT Secret key"
JWT_EXPIRE="10min"

#For password Reset :

EMAIL_SERVICE=""
EMAIL_HOST=""
EMAIL_USERNAME=""
EMAIL_PASSWORD=""
EMAIL_FROM=""
```

# Quick Start :
```Javascript
// Install dependencies for server
npm install

// Run the app
npm run dev

// Server runs on http://localhost:8000
```


