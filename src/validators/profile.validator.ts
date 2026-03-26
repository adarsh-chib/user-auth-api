import z from "zod";

export const createProfileValidator = z.object({
  bio: z
    .string()
    .min(5, "bio must be atleast 5 character")
    .max(200, "bio cannot exceed 200 character"),

  phoneNumber: z
    .string()
    .min(10, "phone number must be exactly 10 number")
    .max(10, "phone number must be exactly 10 number"),

  address: z
    .string()
    .min(1, "address is required")
    .max(100, "address is too long"),

  avatar: z.string().optional(),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Please enter a valid date",
    }),
});
