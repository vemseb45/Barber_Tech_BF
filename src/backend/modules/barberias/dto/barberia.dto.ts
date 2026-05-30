import { z } from "zod";
import { CreateBarberiaSchema, UpdateBarberiaSchema } from "../validators/barberia.validator";

export type CreateBarberiaDTO = z.infer<typeof CreateBarberiaSchema>;
export type UpdateBarberiaDTO = z.infer<typeof UpdateBarberiaSchema>;