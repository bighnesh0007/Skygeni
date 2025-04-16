[Assinment](https://docs.google.com/document/d/1Du1i_2Hy2ghif4vTd17kP4h1yvv0UU1PdySxvoO-tP4/edit?tab=t.0)  

![Screenshot 2025-04-16 150137](https://github.com/user-attachments/assets/056f5028-e207-4b02-a7ab-273bd60ce069)
![Screenshot 2025-04-16 150120](https://github.com/user-attachments/assets/1850d77a-6b14-4dc0-bcbb-2c797c0c5592)
![Screenshot 2025-04-16 150129](https://github.com/user-attachments/assets/3890a5f3-1858-43ed-b513-0cd218a8d6c5)

# Backend API

This is the backend API for our MERN stack application built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas)

## Setup

1. Clone the repository
2. Navigate to the backend directory

```bash
cd backend
```

3. Install dependencies

```bash
npm install
```

4. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_jwt_secret
```

## Running the Application

### For development

```bash
npm run dev
```

This will start the server with nodemon for automatic reloading.

### For production

```bash
npm start
```

The server will run on http://localhost:5000 by default.

## Scripts

- `npm start` - Run the production server
- `npm run dev` - Run the development server with nodemon
- `npm test` - Run tests


# Next.js Client

This is the frontend client for our MERN stack application built with Next.js.

## Prerequisites

- Node.js (v18 or higher)

## Setup

1. Clone the repository
2. Navigate to the client directory

```bash
cd client
```

3. Install dependencies

```bash
npm install
```

4. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running the Application

### For development

```bash
npm run dev
```

This will start the Next.js development server on http://localhost:3000.

### For production build

```bash
npm run build
npm start
```

### For static export

```bash
npm run build
npm run export
```


## Project Structure

```
├── public/
├── components/
├── styles/     # CSS/SCSS styles
├── context/    # React Context
└── utils/      # Utility functions
├── app/
│   ├── pages/      # Next.js pages
└── next.config.js  # Next.js configuration
```

## Scripts

- `npm run dev` - Run the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
