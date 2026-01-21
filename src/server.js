
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from './config/env_config.js';
import { roleEnum, userTable } from './db/schema.js';
const db = drizzle(env.database_url);

// (async ()=>{await db.insert(userTable).values({name:"Shyam",phone:"9876543210",password_hash:"this is password hash",role:'OWNER'})})();
(async ()=>{
    const data = await db.select().from(userTable)
    console.log(data)
})()
