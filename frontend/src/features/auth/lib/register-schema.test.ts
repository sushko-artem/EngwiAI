import { describe, expect, it } from "vitest";
import { RegisterSchema } from "./register-schema";

describe("register schema", () => {
  it("should validate required fields", async () => {
    await expect(
      RegisterSchema.validate({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      }),
    ).rejects.toThrow();
  });

  it("should validate name length", async () => {
    await expect(
      RegisterSchema.validate({
        name: "J",
        email: "test@mail.com",
        password: "123456",
        confirmPassword: "123456",
      }),
    ).rejects.toThrow("Имя должно содержать минимум 2 символа");
  });

  it("should validate email format", async () => {
    await expect(
      RegisterSchema.validate({
        name: "John",
        email: "invalid",
        password: "123456",
        confirmPassword: "123456",
      }),
    ).rejects.toThrow("Неверный формат email-адреса");
  });

  it("should validate password length", async () => {
    await expect(
      RegisterSchema.validate({
        name: "John",
        email: "test@mail.com",
        password: "123",
        confirmPassword: "123",
      }),
    ).rejects.toThrow("Пароль должен содержать минимум 6 символов");
  });

  it("should validate password match", async () => {
    await expect(
      RegisterSchema.validate({
        name: "John",
        email: "test@mail.com",
        password: "123456",
        confirmPassword: "123457",
      }),
    ).rejects.toThrow("Пароли не совпадают");
  });
});
