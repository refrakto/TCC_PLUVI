import { createDatabase } from 'db0';
import mysql from 'db0/connectors/mysql2';
import { drizzle } from "db0/integrations/drizzle";

import * as schema from "../database/schema/index";

const db0 = createDatabase(mysql({
  database: process.env.MYSQL_DatabaseName,
  user: process.env.MYSQL_User,
  password: process.env.MYSQL_Password,
  host: 'localhost',
  port: 3306
}))

export function useDrizzle() {
    return drizzle<typeof schema>(db0);
}
