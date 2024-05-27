import { z } from "zod";
import { registerSchema } from "../zodSchema/zodSchema";

export type RegisterData = z.infer<typeof registerSchema>;
