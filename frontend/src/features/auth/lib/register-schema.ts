import * as yup from "yup";

export const RegisterSchema = yup.object({
  name: yup
    .string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .required("Обязательно для заполнения"),
  email: yup
    .string()
    .email("Неверный формат email-адреса")
    .required("Обязательно для заполнения"),
  password: yup
    .string()
    .min(6, "Пароль должен содержать минимум 6 символов")
    .required("Обязательно для заполнения"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Пароли не совпадают")
    .required("Обязательно для заполнения"),
});
export type RegisterSchema = yup.InferType<typeof RegisterSchema>;
