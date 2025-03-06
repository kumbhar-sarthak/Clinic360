# Clinic360

Easy to use responsive web applicatio to book appointment and search for the doctor nearest to your location

![License](https://img.shields.io/badge/license-MIT-green)
![Build](https://img.shields.io/badge/build-passing-brightgreen)


## Table of Contents
- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)


## About the Project

This is a full-stack application that allows users to do Search for Doctors and Book Appointment. Built with React and Express.


## Tech Stack

**Frontend:** React, Vite, Tailwind CSS  
**Backend:** Node.js, Express, MongoDB  


## Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/kumbhar-sarthak/Clinic360.git
   ```

2. Go to Dict(as need):
   ```sh
   cd ./backend #for backend
   cd ./frontend #for frontend
   ```

3. Create .env file:

   ## Add the necessary Values
      
      1. DB_URL
      2. JWT_SEC
      3. ACCESS_TOKEN_EXPIRY
      4. REFRESH_TOKEN_EXPIRY
      5. PORT
      6. HOST
      7. ORIGIN
      8. NODE_ENV (production || devlopment )

4. Now run the script
   ```sh
   npm run dev # for devlopment
   ```

5. Come to Frontend Part
   ```sh
   cd ./frontend
   npm install
   ```

6. Start the dev
   ```sh
   npm run dev
   ```



## **7️⃣ Usage**
How to use the application.

  ```md

  1. Register or log in to your account.
  2. Specifiy The role.
  3. Logout When Done.

  ```



## 8️⃣ API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register a new user  
- `POST /api/auth/login` - Authenticate user and return JWT  
- `POST /api/auth/logout` - Log out user and clear session  
- `POST /api/auth/refresh` - refresh token

### User Routes
- `GET /api/user/me` - Get user profile by ID 

### Appointment Routes
- `POST /api/appointment/book` - Book an appointment  
- `GET /api/appointment/all` - Get appointment details  
- `Patch /api/appointment/cancel/:id` - Cancel appointment


### Doctor Routes
- `POST /api/appointment/search` - To search doctors
- `PUT /api/doctor/:doctorId` - Update doctor information  

<br>


## Frontend Part

Created Different Compontents

1. `/src/components/Navbar` - To Create the interactive Navbar
2. `/src/components/Profile` - To Create the Profile
3. `/src/pagees/Appointment` - To Book Appointment
4. `/src/pages/ListAppointment` - To Display All the Appointment
5. `/src/pages/Home` - Home Page
6. `/src/components/Login` - Login Page
7. `/src/pages/Register` - Register Page


<br>
<br>

# Contributing

Contributions are welcome! To contribute:

1. Fork the project.
2. Create a new branch (`git checkout -b new-branch`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin new-branch`).
5. Open a Pull Request.
