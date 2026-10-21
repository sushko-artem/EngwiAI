import type { FormikContextType } from "formik";
import type { AuthSchema } from "@features/auth";
import { InputField } from "./input-field";
import { Button } from "@shared/ui/button";

type SignInFormContainerPropType = {
  formik: FormikContextType<AuthSchema>;
};

export const SignInFormContainer = ({
  formik,
}: SignInFormContainerPropType) => {
  const {
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    touched,
    errors,
    status,
    isValid,
    isSubmitting,
  } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        type="email"
        name="email"
        id="email"
        label="Ваша эл. почта"
        placeholder="Введите почту"
        value={values.email}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {touched.email && errors.email ? (
        <div className="text-red-500 text-xs">{errors.email}</div>
      ) : null}
      <InputField
        type="password"
        name="password"
        id="password"
        label="Пароль"
        placeholder="Введите пароль"
        value={values.password}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {touched.password && errors.password ? (
        <div className="text-red-500 text-xs">{errors.password}</div>
      ) : null}
      {status?.backendError && (
        <div className="text-white text-md mt-4 p-2 bg-red-400 rounded">
          Ошибка! {status.backendError}
        </div>
      )}
      <Button
        className="hover:cursor-pointer mt-6"
        type="submit"
        disabled={!isValid || isSubmitting}
      >
        Войти
      </Button>
    </form>
  );
};
