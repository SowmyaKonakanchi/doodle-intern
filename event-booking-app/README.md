# Event Booking Application

A comprehensive event booking system with user authentication, event management, and location-based search.

## Features

✔ User Registration & Login
✔ JWT Authentication
✔ Admin Event Creation
✔ Join Events
✔ Prevent Overlapping Events
✔ View Events with Pagination
✔ View Event Participants
✔ Booking History
✔ Cancel Booking (8-hour rule)
✔ Email Notifications
✔ OTP Password Reset
✔ Profile Update
✔ Search Events by Location
✔ Nearby Events (Distance-based)

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT Authentication
- Nodemailer
- bcryptjs

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Run

```bash
node server.js
```

Server runs on port 5000.

## API Endpoints

See Postman collection for complete API documentation.
