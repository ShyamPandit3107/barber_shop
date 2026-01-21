import dotenv from 'dotenv'
import { except } from 'drizzle-orm/gel-core'
dotenv.config()
export const env = {
    database_url:process.env.DATABASE_URL
}