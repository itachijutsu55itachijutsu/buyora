import { db } from ".";
import { eq } from "drizzle-orm";
import { users, products, comments, NewUser, NewProduct, NewComment } from "./schema";


{/*User Queries */}
// Create User
export const createUser = async (data: NewUser) => {
    const [user] = await db.insert(users).values(data).returning();
    return user;
}

// Get User By Id
export const getUserById = async (id: string ) => {
    return db.query.users.findFirst({ where: eq(users.id, id)})
};

// Update user
export const updateUser = async ( id: string, data: Partial<NewUser>) => {
   const existingUser = await getUserById(id);
    if(!existingUser) {
        throw new Error(`User with ${id} not found`);
    }
    const [user] = await db.update(users).set(data).where(eq(users.id ,id)).returning();
    return user;
}

// Upsert user -> update the user that doesnt exist, (if the user doesnt exist then create and update it)
export const upsertUser = async ( data: NewUser) => {
    // this is what we done first
    const existingUser = await getUserById(data.id);
    // if (!existingUser){
    // return updateUser(data.id, data);
    // } 
    // return createUser(data);
    // And this is what code Rabbit suggested
    const [user] = await db.insert(users).values(data).onConflictDoUpdate({
        target : users.id,
        set: data,}).returning();
        return user;
};


{/*Product Queries */}
// Create Product
export const createProduct = async (data: NewProduct) => {
    const [product] = await db.insert(products).values(data).returning();
    return product;
};

// Get All Products -> with user details and latest products first
export const getAllProducts = async () => {
    return db.query.products.findMany({
        with: { user: true },
        orderBy: (products, { desc }) => [desc(products.createdAt)], // desc means: you will see the latest products first
        // the square brackets are required because Drizzle ORM's orderBy expects an array, even for a single column.
    });
};

// Get Product By Id -> with user details and comments (with user details)
export const getProductById = async (id: string) => {
    return db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
            user: true,
            comments: {
                with: { user: true },
                orderBy: (comments, { desc }) => [desc(comments.createdAt)],
            },
        },
    });
};

// Get Products By User Id -> get all products created by a specific user
export const getProductsByUserId = async (userId: string) => {
    return db.query.products.findMany({
        where: eq(products.userId, userId),
        with: { user: true },
        orderBy: (products, { desc }) => [desc(products.createdAt)],
    });
};

// Update Product
export const updateProduct = async (id: string, data: Partial<NewProduct>) => {
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
        throw new Error(`Product with id ${id} not found`);
    }
    const [product] = await db.update(products).set(data).where(eq(products.id, id)).returning();
    return product;
};

// Delete Product
export const deleteProduct = async (id: string) => {
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
        throw new Error(`Product with id ${id} not found`);
    }
    const [product] = await db.delete(products).where(eq(products.id, id)).returning();
    return product;
};


{/*Comment Queries */}
// Create Comment
export const createComment = async (data: NewComment) => {
    const [comment] = await db.insert(comments).values(data).returning();
    return comment;
};

// Get Comment By Id
export const getCommentById = async (id: string) => {
    return db.query.comments.findFirst({
        where: eq(comments.id, id),
        with: { user: true },
    });
};

// Delete Comment
export const deleteComment = async (id: string) => {
    const existingComment = await getCommentById(id);
    if (!existingComment) {
        throw new Error(`Comment with id ${id} not found`);
    }
    const [comment] = await db.delete(comments).where(eq(comments.id, id)).returning();
    return comment;
};