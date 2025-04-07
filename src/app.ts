import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes'; 
import userRoutes from './routes/userRoutes';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ message: "Pong!" });
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

export default app;
