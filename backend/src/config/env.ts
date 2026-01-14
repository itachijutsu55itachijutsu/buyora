import dotenv from "dotenv"

dotenv.config({ quiet: true })

export const env = {
    PORT: parseInt(process.env.PORT || '3000'),
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV || 'development',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
} as const;