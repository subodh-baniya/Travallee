import e from "express";
import zod, { email, number } from "zod";
// for database 

export const UserType = zod.object({
    id: zod.string().optional(),
    Name: zod.string().min(2, "Name must be at least 2 characters long"),
    email: zod.string().email(),
    number: zod.number().min(1000000000, "Phone number must be at least 10 digits long").max(9999999999, "Phone number must be at most 10 digits long").optional(),
    Username: zod.string().min(3, "Username must be at least 3 characters long").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: zod.string().min(6, "Password must be at least 6 characters long"),
    createdAt: zod.date(),
    updatedAt: zod.date(),
    profileimage: zod.string().optional(),
    role: zod.string().optional(),
    googleId: zod.string().optional(),
    isVerified: zod.boolean().optional(),
    otp: zod.number().optional(),
    otpExpiry: zod.date().optional(),
    refreshToken: zod.string().optional(),

})  


// for register validation
export const registerSchema = zod.object({
    Username: zod.string().min(3, "Username must be at least 3 characters long").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: zod.string().min(6, "Password must be at least 6 characters long"),
    email: zod.string().email("Invalid email address"),
    role: zod.string().optional(),
    Name: zod.string().min(2, "Name must be at least 2 characters long"),
    number: zod.number().min(1000000000, "Phone number must be at least 10 digits long").max(9999999999, "Phone number must be at most 10 digits long").optional(),
})  

// for login validation
export const loginSchema = zod.object({
    email: zod.string().email("Invalid email address").optional(),
    Username: zod.string().min(3, "Username must be at least 3 characters long").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores").optional(),
    password: zod.string().min(6, "Password must be at least 6 characters long"),
}).refine((data) => data.email || data.Username, {
    message: "Either email or username is required",
    path: ["email"],
})

export type UserType = zod.infer<typeof UserType>;
