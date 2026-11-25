import { z } from "zod";
const AuthSchema = z.object({
  email: z.string().email("Invalid Email").min(0, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(2, "Password should be at least 2 characters")
    .max(8, "Password should not exceed 8 characters"),
});

export type IAuthSchema = z.infer<typeof AuthSchema>;

const validateAuth = (user: IAuthSchema) => {
  return AuthSchema.safeParse(user);
};

export { AuthSchema, validateAuth };
