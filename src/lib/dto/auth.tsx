import { z } from "zod";

const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const loginDTO = z.object({
  username: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
});

export const registerDTO = z
  .object({
    name: z.string().min(1).max(255),
    username: z.string().min(1).max(255),
    password: z.string().refine((value) => regex.test(value), {
      message: `Password must be at least 8 characters long 
        and contain at least one uppercase character, one 
        lowercase character, and one special symbol`,
    }),
    confirm: z.string().min(1).max(255),
  })
  .superRefine(({ password, confirm }, ctx) => {
    if (password !== confirm)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirm"],
        message: "Passwords do not match",
      });
  });

export type TLoginDTO = z.infer<typeof loginDTO>;
export type TRegisterDTO = z.infer<typeof registerDTO>;
