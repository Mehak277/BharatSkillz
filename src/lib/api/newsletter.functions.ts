import { createServerFn } from "@tanstack/react-start";

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    if (!data.email.includes("@")) return { ok: false, error: "Invalid email" };
    return { ok: true };
  });
