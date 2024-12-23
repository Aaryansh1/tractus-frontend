import z from "zod";

export const contractSchema = z.object({
  id: z.string(),
  name: z
    .string({
      message: "Contract name is required",
    })
    .min(3, {
      message: "Contract name must be at least 3 characters",
    }),
  clientName: z
    .string({
      message: "Client name is required",
    })
    .min(3, {
      message: "Client name must be at least 3 characters",
    }),
  status: z.enum(["draft", "in-progress", "complete"]),
});

export const newContractSchema = contractSchema.omit({
  id: true,
  status: true,
});
