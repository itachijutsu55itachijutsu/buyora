import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

// product table 

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull().unique(),
  description: text('description').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

// comment table

export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
});

// RELATIONS: relations defines how tabels are connects to each others!
// Example userRelations: now user can have many products and many comments, `many()` means ouser have multiple recods

export const usersRelations = relations(users, ({ many }) => ({
	products: many(products),
    comments: many(comments),
}));

// Product relations ,product have one user (owner) & have many comments `one()` single realtion & `many()` means multiple records
export const productsRelations = relations(products, ({ one, many }) => ({
    comments: many(comments),
    user: one(users, {
        fields: [products.userId], 
        references: [users.id]}),
}));

// comment relattions : have one userid(owner) &one product

export const commentsRelations = relations(comments, ({ one }) => ({
    user: one(users, {
        fields: [comments.userId], 
        references: [users.id]}),
    product: one(products, {
        fields: [comments.productId],
        references: [products.id],     
    })
}));

// At the end of schema file

// User types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Product types
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

// Comment types
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;