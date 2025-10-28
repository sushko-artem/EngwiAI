import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import {
  AuthFormLayout,
  BottomAuthLayout,
  GoogleAuth,
  AuthLink,
  AuthSchema,
  InputField,
  useLoginMutation,
} from "@features/auth";
import { Button } from "@shared/ui/button";
import { Loader } from "@shared/ui/loader";
import { getErrorMessage, isFetchBaseQueryError } from "@shared/api";

export const SignInForm = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const formik = useFormik<AuthSchema>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: AuthSchema,
    onSubmit: async (data: AuthSchema) => {
      try {
        await login(data).unwrap();
        navigate("/dashboard", { replace: true });
      } catch (error) {
        if (isFetchBaseQueryError(error) && error.status === 401) {
          const errorData = error.data as {
            message: string;
            error: string;
          };
          formik.setErrors({ [errorData.error]: errorData.message });
        } else {
          formik.setStatus({
            backendError: getErrorMessage(error),
          });
        }
      }
    },
  });

  return (
    <>
      {isLoading && <Loader />}
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
