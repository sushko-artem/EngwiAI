import { useFormik } from "formik";
import { AuthFormLayout } from "../ui/auth-form-layout";
import { BottomAuthLayout } from "../ui/bottom-layout";
import { GoogleAuth } from "../ui/google-auth-button";
import { AuthLink } from "../ui/link";
import { AuthSchema } from "../lib/auth-schema";
import { Button } from "@shared/ui/button";
import { InputField } from "../ui/input-field";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import { Loader } from "@shared/ui/loader";

export const SignInForm = () => {
  const { logIn, loading } = useAuth();
  const navigate = useNavigate();
  const formik = useFormik<AuthSchema>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: AuthSchema,
    onSubmit: async (data: AuthSchema) => {
      const res = await logIn(data);
      if (res.success) {
        navigate("/dashboard", { replace: true });
      } else if (res.cause === 401) {
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
        title="ВХОД"
        description="Введите данные, чтобы войти в приложение."
        form={
          <form onSubmit={formik.handleSubmit}>
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
              Войти
            </Button>
          </form>
        }
        bottomLayout={
          <BottomAuthLayout
            google={<GoogleAuth description={"Войти с Google"} />}
            link={
              <AuthLink
                text={""}
                url={"/sign-up"}
                linkText={"Пройти регистрацию"}
              />
            }
          />
        }
      />
    </>
  );
};
