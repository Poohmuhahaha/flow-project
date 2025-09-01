import { uuid, integer, pgTable, varchar } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  confirmpassword: varchar("password", { length: 255 }).notNull()
});

export const apitest = pgTable("apitest", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});