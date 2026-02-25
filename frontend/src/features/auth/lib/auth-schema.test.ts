import { describe, expect, it } from "vitest";
import { AuthSchema } from "./auth-schema";

describe("auth schema", () => {
  it("should validate required fields", async () => {
    await expect(
      AuthSchema.validate({
        email: "",
        password: "",
      }),
    ).rejects.toThrow();
  });

  it("should validate email format", async () => {
    await expect(
      AuthSchema.validate({
        email: "invalid",
        password: "123456",
      }),
    ).rejects.toThrow("Неверный формат email-адреса");
  });

  it("should validate password length", async () => {
    await expect(
      AuthSchema.validate({
        email: "test@mail.com",
        password: "123",
      }),
    ).rejects.toThrow("Пароль должен содержать минимум 6 символов");
  });
});
