# WTWR Backend

This is the Express and MongoDB backend for WTWR (What to Wear). It provides user authentication, user profile endpoints, and clothing item endpoints for the React frontend.

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token authentication
- bcrypt password hashing

## Installation

```bash
npm install
```

## Environment

The server reads its MongoDB connection string and port from environment variables.

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Default values:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db
PORT=3001
```

The default `MONGODB_URI` uses a local MongoDB database named `wtwr_db`, so reviewers can run the backend without a MongoDB Atlas account.

To use MongoDB Atlas, set `MONGODB_URI` in `.env` to your Atlas connection string.

## Running With Local MongoDB

1. Start MongoDB locally.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm run start
   ```

The API runs on port `3001` by default.

## Available Scripts

- `npm run start` - starts the server with `node app.js`
- `npm run dev` - starts the server with `nodemon app.js`
- `npm run lint` - runs ESLint

## API Routes

### Public Routes

- `GET /` - health check
- `POST /signup` - create a new user
- `POST /signin` - sign in and receive a JWT
- `GET /items` - get all clothing items
- `GET /items/ping` - clothing item router health check

### Protected Routes

These routes require an `Authorization: Bearer <token>` header.

- `GET /users/ping` - users router health check
- `GET /users/me` - get the current user
- `PATCH /users/me` - update the current user's profile
- `POST /items` - create a clothing item
- `GET /items/:itemId` - get a clothing item by ID
- `DELETE /items/:itemId` - delete a clothing item owned by the current user
- `PUT /items/:itemId/likes` - like a clothing item
- `DELETE /items/:itemId/likes` - remove a like from a clothing item
