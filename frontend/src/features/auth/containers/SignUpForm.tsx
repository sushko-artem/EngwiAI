import { Button } from "@shared/ui/button";
import { RegisterSchema } from "../lib/register-schema";
import { AuthFormLayout } from "../ui/auth-form-layout";
import { BottomAuthLayout } from "../ui/bottom-layout";
import { GoogleAuth } from "../ui/google-auth-button";
import { InputField } from "../ui/input-field";
import { AuthLink } from "../ui/link";
import { useFormik } from "formik";
import { useAuth } from "@features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Loader } from "@shared/ui/loader";

export const SignUpForm = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const formik = useFormik<RegisterSchema>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (data: RegisterSchema) => {
      const user = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      const res = await register(user);
      if (res.success) {
        navigate("/sign-in");
      } else if (res.cause === 409) {
        formik.setErrors({ email: res.error });
      } else {
        formik.setStatus({ backendError: res.error });
      }
    },
  });
  return (
    <>
      {loading && <Loader />}
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
              type="password"
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
              type="password"
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
            {formik.status?.backendError && (
              <div className="text-white text-md mt-4 p-2 bg-red-400 rounded">
                Ошибка! {formik.status.backendError}
              </div>
            )}
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
