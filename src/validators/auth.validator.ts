import z from "zod";

export const signupValidator = z.object({
  profileImage: z.string().url().optional(),
  name: z
    .string()
    .min(2, "name must be required")
    .min(2, "name must be atleat 2 characters")
    .trim(),

  email: z
    .string()
    .min(1, "email is required")
    .min(6, "password should atleast 6 character"),

  password: z
    .string()
    .min(6, "password must be at least 6 characters")
    // .regex(/[a-z]/, "must contain at least one lowercase letter")
    // .regex(/[A-Z]/, "must contain at least one uppercase letter")
    // .regex(/[0-9]/, "must contain at least one number"),
  ,
  role: z.string().refine((val) => ["user", "admin", "manager"].includes(val), {
    message: "role must be admin user or manager",
  }),
});

export const signinValidator = z.object({
  email: z.string().min(1, "email is required").email("invalid email"),
  password: z.string(),
  // .min(6, "password must be at least 6 character")
  // .regex(/[a-z]/, "must contain atleast one charcter")
  // .regex(/[A-Z]/, "must contain at least one uppercase letter")
  // .regex(/[0-9]/, "must contain at least one number"),
});

export const resetPasswordValidator = z.object({
  email: z.string().min(1, "email is required"),
  newpassword: z
    .string()
    .min(6, "password must be at least 6 character")
    .max(15, "password must be at least 6 character")
    .regex(/[a-z]/, "must contain atleast one charcter")
    .regex(/[A-Z]/, "must contain at least one uppercase letter")
    .regex(/[0-9]/, "must contain at least one number"),
});

export const updateValidator = signupValidator.partial();
