// server/src/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;