import { table } from "console";
import { uuid } from "drizzle-orm/pg-core";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";


export const usersTable = pgTable("users_table",{
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  username: varchar("username").notNull(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull()
})