import express from "express"
import dotenv from "dotenv"
import {env} from "./config/env"
import { clerkMiddleware } from '@clerk/express'
import cors from 'cors'

const app = express();
dotenv.config()
const PORT = 3000
app.use(clerkMiddleware())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.FRONTEND_URL }));

app.get('/', (req, res) => {
    res.json({ message: `Server is running on port ${PORT}` })       
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})