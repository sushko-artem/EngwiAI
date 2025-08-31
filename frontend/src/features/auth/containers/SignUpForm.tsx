import { Button } from "@shared/ui/button";
import { RegisterSchema } from "../lib/register-schema";
import { AuthFormLayout } from "../ui/auth-form-layout";
import { BottomAuthLayout } from "../ui/bottom-layout";
import { GoogleAuth } from "../ui/google-auth-button";
import { InputField } from "../ui/input-field";
import { AuthLink } from "../ui/link";
import { useFormik } from "formik";

export const SignUpForm = () => {
  const formik = useFormik<RegisterSchema>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: (data: RegisterSchema) => console.log(data),
  });
  return (
    <>
      <AuthFormLayout
        title="РЕГИСТРАЦИЯ"
        form={
          <form onSubmit={formik.handleSubmit}>
            <InputField
              type="text"
              name="name"
              id="name"
              label="Имя"
              placeholder="Введите имя"
              value={formik.values.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-xs">{formik.errors.name}</div>
            ) : null}
            <InputField
              type="email"
              name="email"
              id="email"
              label="Ваша эл. почта"
              placeholder="Введите почту"
              value={formik.values.email}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-xs">{formik.errors.email}</div>
            ) : null}
            <InputField
              type="text"
              name="password"
              id="password"
              label="Пароль"
              placeholder="Введите пароль"
              value={formik.values.password}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-xs">
                {formik.errors.password}
              </div>
            ) : null}
            <InputField
              type="text"
              name="confirmPassword"
              id="confirmPassword"
              label="Подтвердите пароль"
              placeholder="Подтвердите пароль"
              value={formik.values.confirmPassword}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-500 text-xs">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
            <Button
              className="hover:cursor-pointer mt-6"
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Зарегистрироваться
            </Button>
          </form>
        }
        bottomLayout={
          <BottomAuthLayout
            google={<GoogleAuth description={"Регистрация с Google"} />}
            link={
              <AuthLink
                text={"Уже регистрировались ранее?"}
                url={"/sign-in"}
                linkText={"Войти"}
              />
            }
          />
        }
      />
    </>
  );
};
