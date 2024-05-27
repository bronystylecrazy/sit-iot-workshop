import { z } from "zod";

export const addTaskFormData = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
});

export type AddTaskFormData = z.infer<typeof addTaskFormData>;
