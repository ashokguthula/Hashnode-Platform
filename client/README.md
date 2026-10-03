# Hashnode Platform

A full-stack developer blogging and publishing platform built with the MERN stack.

## Overview

This application allows developers to register, authenticate, write technical articles using Markdown, save drafts, publish posts, organize content with tags, search published articles, and manage their profiles.

## Features

### Authentication

- User registration
- User login
- JWT authentication
- bcrypt password hashing
- Protected routes
- Persistent authentication

### Posts

- Create posts
- Edit own posts
- Delete own posts
- Save posts as drafts
- Publish posts
- Slug-based article URLs
- Public article feed
- Article search

### Tags

- Create and reuse tags
- Filter posts by tag
- View tag post counts

### Profiles

- Public developer profiles
- Published articles on profiles
- Edit own profile

### Markdown

- Markdown editor
- Live preview
- Code syntax highlighting
- Markdown sanitization

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- Axios
- react-markdown
- react-syntax-highlighter
- rehype-sanitize

### Backend

- Node.js
- Express.js
- JavaScript
- Mongoose
- MongoDB
- JWT
- bcryptjs
- CORS
- dotenv

## Project Structure

```text
Hashnode-Platform/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── pages/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── .gitignore
└── README.md
```
