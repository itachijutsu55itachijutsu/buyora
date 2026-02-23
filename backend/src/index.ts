import express from "express"
import dotenv from "dotenv"
import {env} from "./config/env"
import { clerkMiddleware, requireAuth } from "@clerk/express";
import cors from 'cors'
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";
import { db } from "./db";
import { sql } from "drizzle-orm";

const app = express();
dotenv.config()
const PORT = 3000
app.use(clerkMiddleware())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.FRONTEND_URL,  credentials: true}));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
    res.json({ message: `Server is running on port ${PORT}` })       
})

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`)
    
    // Test database connection
    try {
        await db.execute(sql`SELECT 1`);
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection error:', error);
    }
})