# Online Job Portal Backend

A Node.js Express backend using Express and MongoDB (via Mongoose).

## Features

- User profiles
- Experience and education management
- Connections system
- MongoDB database with Mongoose ODM

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/online_job_portal
   ```
4. Start the development server (runs on http://localhost:5000):
  ```bash
  npm run dev
  ```

## API Endpoints

### Routes (for frontend integration)

- Users (`/api/users`)
  - GET `/:id` → Get user by id
  - PUT `/:id` → Update user profile fields { firstName, lastName, title, location, description }
  - PUT `/:id/skills` → Update skills { skills: string[] }
  - POST `/:id/profile-image` → Upload profile image (form-data: profileImage: file)
    - Response includes `profileImageUrl` to use in frontend

- Media (`/api/media`)
  - GET `/:id` → Stream image/file stored in MongoDB

- Projects (`/api/projects`)
  - POST `/` → Create project { user_id, topic, description?, skill?: string[], year }
  - GET `/` → List all projects
  - GET `/:id` → Get project by id
  - PUT `/:id` → Update project
  - DELETE `/:id` → Delete project

- Experiences (`/api/experiences`)
  - POST `/` → Create experience { user_id, title, description, from_year, to_year? }
  - GET `/` → List all experiences
  - GET `/:id` → Get experience by id
  - PUT `/:id` → Update experience
  - DELETE `/:id` → Delete experience

- Messages (`/api/messages`)
  - POST `/` → Create message { sender_id, receiver_id, message_text }
  - GET `/user/:userId` → List messages for a user (includes populated sender/receiver basic fields)
  - GET `/conversation/:userId1/:userId2` → Get conversation between two users
  - PUT `/:id` → Update message text
  - DELETE `/:id` → Delete message

- Posts (`/api/posts`)
  - POST `/` → Create post (form-data: images[] files, fields: title, description, user_id)
    - Saves images into MongoDB; `images` = array of media ids; `image_url` = first image `/api/media/:id`
  - GET `/` → List posts with pagination and filters
    - Query: `page`, `limit`, `job_type?`, `location?`, `search?`
  - GET `/:id` → Get post by id
  - PUT `/:id` → Update post fields and optionally upload new images (supports `deleteOldImages=true`)
  - DELETE `/:id` → Delete post (removes associated media)

## Project Structure

```
src/
  ├── config/        # Database configuration
  ├── controllers/   # Route controllers
  ├── models/        # Database models
  ├── routes/        # API routes
  └── server.js      # Entry point
```

## Development

The server will automatically restart when you make changes to the code (using nodemon).

## License

MIT 