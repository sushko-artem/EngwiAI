import * as yup from "yup";

export const AuthSchema = yup.object({
  email: yup
    .string()
    .email("Неверный формат email-адреса")
    .required("Обязательно для заполнения"),
  password: yup
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов")
    .required("Обязательно для заполнения"),
});
export type AuthSchema = yup.InferType<typeof AuthSchema>;
