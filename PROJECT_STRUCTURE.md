# Online Job Portal Backend - Project Structure & Technologies

## Technologies Used

- **Node.js**: JavaScript runtime environment for building scalable backend applications.
- **Express**: Fast, minimalist web framework for Node.js, used to create RESTful APIs.
- **MongoDB**: NoSQL document database for storing application data.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js, provides schema-based solutions.
- **Multer**: Middleware for handling file uploads (images, etc.) in Express.
- **Nodemon**: Utility that automatically restarts the server when code changes during development.

## Folder Structure & Usage

```
src/
  ├── config/        # Database configuration and environment setup
  ├── controllers/   # Business logic for each API endpoint
  ├── models/        # Mongoose schemas/models for MongoDB collections
  ├── routes/        # Express route definitions mapping URLs to controllers
  └── server.js      # Main Express app setup and route registration
```

### Folder Details

- **config/**
  - Contains files for database connection and environment configuration.
  - Example: `database.js` connects to MongoDB using Mongoose.

- **controllers/**
  - Contains logic for handling requests and responses for each resource (User, Post, Job, etc.).
  - Example: `userController.js` manages user registration, login, profile updates.

- **models/**
  - Contains Mongoose schemas defining the structure of data in MongoDB.
  - Example: `User.js` defines user fields and validation.

- **routes/**
  - Contains Express route files that map HTTP endpoints to controller functions.
  - Example: `userRoutes.js` defines `/api/users` endpoints and links them to `userController.js`.

- **server.js**
  - Sets up the Express app, middleware (CORS, JSON parsing, Multer), and registers all routes.
  - Connects to MongoDB and starts the server for local development.

## How It Works

1. **Request Flow**: Client sends HTTP request → Route matches endpoint → Controller processes logic → Model interacts with database → Response sent back to client.
2. **File Uploads**: Multer handles image uploads, storing files in MongoDB via the Media model.
3. **Development**: Nodemon watches for code changes and restarts the server automatically.

## Getting Started

- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Test API endpoints using Postman or your frontend.

---

For more details on each folder or technology, ask for a deep dive!
