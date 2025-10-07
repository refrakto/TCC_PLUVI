import { createDatabase } from 'db0';
import mysql from 'db0/connectors/mysql2';
import { drizzle } from "db0/integrations/drizzle";
import * as schema from "../database/schema";

export default defineNitroPlugin((nitroApp) => {
    const db0 = createDatabase(mysql({
        database: process.env.MYSQL_DatabaseName,
        user: process.env.MYSQL_User,
        password: process.env.MYSQL_Password,
        host: 'localhost',
        port: 3306
    }))

    const db = drizzle<typeof schema>(db0);

    nitroApp.hooks.hook(
        'request', 
        (event) => {event.context.db = db}
    )
})
