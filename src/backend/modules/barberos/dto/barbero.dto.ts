import { z } from "zod";
import { CreateBarberoSchema } from "../validators/barbero.validator";

export type CreateBarberoDTO = z.infer<typeof CreateBarberoSchema>;