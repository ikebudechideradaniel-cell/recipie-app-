import {pgTable, serial, text, timestamp,integer} from "drizzle-orm/pg-core";

export const favouritesTable = pgTable("favourites", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    recipeId: integer("recipe_id").notNull(),
    title: text("title").notNull(),
    image: text("image"),
    cookTime: integer("cook_time").notNull(),
    servings: integer("servings"),
    created_at: timestamp("created_at").defaultNow()
})